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

export async function sendPromoOfferEmail(email: string, subject: string, customMessage: string): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn("⚠️ GMAIL_USER or GMAIL_PASS not set. Promo emails won't be sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"Songify AI" <${process.env.GMAIL_USER}>`,
    to: email.toLowerCase().trim(),
    subject: subject,
    html: `
      <html>
        <head>
          <style>
            @media (prefers-color-scheme: dark) {
              .email-body {
                background-color: #0E1821 !important;
                color: #f1f5f9 !important;
                border-color: rgba(255, 25, 25, 0.08) !important;
              }
              .email-title {
                color: #818cf8 !important;
              }
              .email-box {
                background-color: #1f2937 !important;
                color: #e2e8f0 !important;
                border-color: rgba(255, 255, 255, 0.08) !important;
              }
              .email-text {
                color: #94a3b8 !important;
              }
              .email-divider {
                border-top-color: rgba(255, 255, 255, 0.1) !important;
              }
              .email-footer {
                color: #475569 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 10px; background-color: transparent;">
          <div class="email-body" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; background-color: #ffffff; color: #1f2937;">
            <h2 class="email-title" style="color: #4f46e5; text-align: center; margin-top: 10px; margin-bottom: 20px;">${subject}</h2>
            <div class="email-box" style="background-color: #f3f4f6; color: #374151; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${customMessage}</div>
            <p class="email-text" style="font-size: 14px; line-height: 1.5; color: #4b5563;">
              Your 24-hour premium subscription has started! Register or log in to Songify using this email to access the studio and generate unlimited high-quality songs.
            </p>
            <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
              <a href="${siteUrl}/studio" style="background: linear-gradient(135deg, #6366f1, #818cf8); color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
                Go to Songify Studio
              </a>
            </div>
            <hr class="email-divider" style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 20px; margin-bottom: 20px;">
            <p class="email-footer" style="font-size: 12px; color: #9ca3af; text-align: center;">
              This 24-hour subscription offer was sent directly by the Songify Administration team.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Promo offer email sent to ${email}`);
}
