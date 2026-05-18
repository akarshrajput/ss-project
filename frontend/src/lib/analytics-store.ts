import { getMongoDb } from "@/lib/mongodb";

export type AnalyticsStatus = "started" | "email_viewed" | "completed";

export type SessionAnalytics = {
  sessionId: string;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number;
  basePrompt: string | null;
  email: string | null;
  status: AnalyticsStatus;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "generatorAnalytics";

// ─── Track / Upsert Event ──────────────────────────────────────────
export async function trackSessionEvent(data: {
  sessionId: string;
  status: AnalyticsStatus;
  lyrics?: string;
  theme?: string | null;
  genre?: string | null;
  mood?: string | null;
  duration?: number;
  basePrompt?: string | null;
  email?: string | null;
}): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();

  const updateFields: Partial<SessionAnalytics> = {
    status: data.status,
    updatedAt: now,
  };

  if (data.lyrics !== undefined) updateFields.lyrics = data.lyrics;
  if (data.theme !== undefined) updateFields.theme = data.theme;
  if (data.genre !== undefined) updateFields.genre = data.genre;
  if (data.mood !== undefined) updateFields.mood = data.mood;
  if (data.duration !== undefined) updateFields.duration = data.duration;
  if (data.basePrompt !== undefined) updateFields.basePrompt = data.basePrompt;
  if (data.email !== undefined) updateFields.email = data.email;

  const setOnInsertFields: Record<string, any> = {
    createdAt: now,
  };

  if (data.lyrics === undefined) setOnInsertFields.lyrics = "";
  if (data.theme === undefined) setOnInsertFields.theme = null;
  if (data.genre === undefined) setOnInsertFields.genre = null;
  if (data.mood === undefined) setOnInsertFields.mood = null;
  if (data.duration === undefined) setOnInsertFields.duration = 30;
  if (data.basePrompt === undefined) setOnInsertFields.basePrompt = null;
  if (data.email === undefined) setOnInsertFields.email = null;

  await db.collection<SessionAnalytics>(COLLECTION).updateOne(
    { sessionId: data.sessionId },
    {
      $set: updateFields,
      $setOnInsert: setOnInsertFields as any,
    },
    { upsert: true }
  );
}

// ─── Query Statistics ──────────────────────────────────────────────
export async function getAnalyticsStats() {
  const db = await getMongoDb();
  const collection = db.collection<SessionAnalytics>(COLLECTION);

  // Total sessions
  const totalStarted = await collection.countDocuments({});

  // Proceeded to email
  const proceededToEmail = await collection.countDocuments({
    status: { $in: ["email_viewed", "completed"] },
  });

  // Completed sessions
  const completed = await collection.countDocuments({ status: "completed" });

  // Drop offs before email (Step 1)
  const dropoffCustomize = await collection.countDocuments({ status: "started" });

  // Drop offs at email step (Step 2)
  const dropoffEmail = await collection.countDocuments({ status: "email_viewed" });

  // Total drop offs
  const totalDropoffs = dropoffCustomize + dropoffEmail;

  // Conversion rates
  const conversionRate = totalStarted > 0 ? Math.round((completed / totalStarted) * 100) : 0;
  const emailProceedRate = totalStarted > 0 ? Math.round((proceededToEmail / totalStarted) * 100) : 0;
  const emailSubmitRate = proceededToEmail > 0 ? Math.round((completed / proceededToEmail) * 100) : 0;

  // Retrieve recent abandoned sessions (drop-offs)
  const recentAbandoned = await collection
    .find({ status: { $in: ["started", "email_viewed"] } })
    .sort({ updatedAt: -1 })
    .limit(50)
    .toArray();

  return {
    totalStarted,
    proceededToEmail,
    completed,
    dropoffCustomize,
    dropoffEmail,
    totalDropoffs,
    conversionRate,
    emailProceedRate,
    emailSubmitRate,
    recentAbandoned,
  };
}
