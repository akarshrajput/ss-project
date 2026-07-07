import { getMongoDb, getMongoDbOrNull } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import { getAppUserProfile } from "@/lib/app-store";

export type NotificationEmail = {
  email: string;
  addedAt: Date;
  addedBy: string;
};

const COLLECTION = "notification_emails";

export async function addNotificationEmail(email: string, addedBy: string): Promise<void> {
  const db = await getMongoDb();
  
  await db.collection<NotificationEmail>(COLLECTION).updateOne(
    { email: email.toLowerCase() },
    {
      $setOnInsert: {
        email: email.toLowerCase(),
        addedAt: new Date(),
        addedBy,
      },
    },
    { upsert: true }
  );
}

export async function removeNotificationEmail(email: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection<NotificationEmail>(COLLECTION).deleteOne({ email: email.toLowerCase() });
}

export async function listNotificationEmails(): Promise<NotificationEmail[]> {
  const db = await getMongoDbOrNull();
  if (!db) return [];

  return db.collection<NotificationEmail>(COLLECTION).find({}).sort({ addedAt: -1 }).toArray();
}

export async function sendSubscriptionNotifications(
  subscriberId: string,
  plan: string,
  amount: number,
  currency: string
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn("⚠️ GMAIL_USER or GMAIL_PASS not set. Notification emails won't be sent.");
    return;
  }

  const notificationEmails = await listNotificationEmails();
  if (notificationEmails.length === 0) {
    return; // No one to notify
  }

  const subscriberProfile = await getAppUserProfile(subscriberId);
  const subscriberName = subscriberProfile?.fullName || "Anonymous";
  const subscriberEmail = subscriberProfile?.email || "Unknown Email";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const bccList = notificationEmails.map(ne => ne.email).join(", ");
  const amountFormatted = (amount / 100).toFixed(2); // amount is in cents
  
  const mailOptions = {
    from: `"Songify AI" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // To avoid spam filters showing empty to:
    bcc: bccList,
    subject: `🎉 New Premium Subscription: ${subscriberName}`,
    html: `
      <h2>New Premium Subscription!</h2>
      <p>Someone just bought a premium subscription on Songify AI.</p>
      <ul>
        <li><strong>Name:</strong> ${subscriberName}</li>
        <li><strong>Email:</strong> ${subscriberEmail}</li>
        <li><strong>Plan:</strong> ${plan}</li>
        <li><strong>Amount:</strong> $${amountFormatted} ${currency.toUpperCase()}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <br>
      <p>Awesome work!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Subscription notification sent to ${notificationEmails.length} admin(s).`);
  } catch (error) {
    console.error("❌ Error sending subscription notifications:", error);
  }
}
