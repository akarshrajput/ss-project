import { getMongoDb, getMongoDbOrNull } from "@/lib/mongodb";
import { sendSubscriptionNotifications } from "@/lib/notification-email-store";

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export type Subscription = {
  userId: string;
  plan: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  startsAt: Date;
  expiresAt: Date;
  createdAt: Date;
};

const COLLECTION = "subscriptions";
const PLAN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createSubscription(
  userId: string,
  stripeSessionId: string,
  paymentIntentId: string | null,
): Promise<Subscription> {
  const db = await getMongoDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PLAN_DURATION_MS);

  const subscription: Subscription = {
    userId,
    plan: "24h-unlimited",
    stripeSessionId,
    stripePaymentIntentId: paymentIntentId,
    amount: 100, // $1.00 in cents
    currency: "usd",
    status: "active",
    startsAt: now,
    expiresAt,
    createdAt: now,
  };

  await db.collection<Subscription>(COLLECTION).insertOne(subscription);
  
  // Fire off notification emails asynchronously in the background
  sendSubscriptionNotifications(userId, subscription.plan, subscription.amount, subscription.currency)
    .catch((err) => console.error("Failed to send subscription notifications:", err));

  return subscription;
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const db = await getMongoDbOrNull();
  if (!db) return null;

  const now = new Date();
  return db.collection<Subscription>(COLLECTION).findOne({
    userId,
    status: "active",
    expiresAt: { $gt: now },
  });
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getActiveSubscription(userId);
  return sub !== null;
}

export async function getAllActiveSubscriptions(): Promise<Subscription[]> {
  const db = await getMongoDbOrNull();
  if (!db) return [];

  const now = new Date();
  return db.collection<Subscription>(COLLECTION).find({
    status: "active",
    expiresAt: { $gt: now },
  }).toArray();
}

export async function expireOldSubscriptions(): Promise<number> {
  const db = await getMongoDbOrNull();
  if (!db) return 0;

  const now = new Date();
  const result = await db.collection<Subscription>(COLLECTION).updateMany(
    { status: "active", expiresAt: { $lte: now } },
    { $set: { status: "expired" } },
  );

  return result.modifiedCount;
}

export async function getSubscriptionByStripeSession(
  stripeSessionId: string,
): Promise<Subscription | null> {
  const db = await getMongoDbOrNull();
  if (!db) return null;

  return db.collection<Subscription>(COLLECTION).findOne({ stripeSessionId });
}

export async function getSubscriptionHistory(userId: string): Promise<Subscription[]> {
  const db = await getMongoDbOrNull();
  if (!db) return [];

  return db.collection<Subscription>(COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}
