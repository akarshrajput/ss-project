import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { deriveUsernameFromEmail } from "@/lib/username-utils";

export type SongQueueStatus = "pending" | "completed" | "rejected";

export type SongQueueEntry = {
  _id?: ObjectId;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number; // seconds
  email: string;
  username: string;
  status: SongQueueStatus;
  /** Generated prompt tags (built from user selections) */
  promptTags: string;
  /** Set when status becomes "completed" */
  songUrl: string | null;
  songId: string; // human-readable slug used in /song/[songId]
  songTitle: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  rejectedAt: Date | null;
  rejectionComment: string | null;
};

const COLLECTION = "songsQueue";

function generateSongId(): string {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${now}-${rand}`;
}

function buildPromptFromSelections(entry: {
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number;
}): string {
  const parts: string[] = [];
  if (entry.genre) parts.push(entry.genre);
  if (entry.mood) parts.push(entry.mood);
  if (entry.theme) parts.push(entry.theme);
  parts.push(`${entry.duration}s`);
  if (entry.lyrics) parts.push(`lyrics: ${entry.lyrics.slice(0, 200)}`);
  return parts.join(" | ");
}

// ─── Create ────────────────────────────────────────────────────────
export async function createSongQueueEntry(data: {
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number;
  email: string;
  username: string;
  songId?: string;
}): Promise<SongQueueEntry> {
  const db = await getMongoDb();
  const now = new Date();
  const songId = data.songId || generateSongId();
  const promptTags = buildPromptFromSelections(data);
  const songTitle = [data.genre, data.mood, data.theme].filter(Boolean).join(" ") || "AI Generated Song";

  const entry: SongQueueEntry = {
    lyrics: data.lyrics,
    theme: data.theme,
    genre: data.genre,
    mood: data.mood,
    duration: data.duration,
    email: data.email,
    username: data.username.toLowerCase().trim(),
    status: "pending",
    promptTags,
    songUrl: null,
    songId,
    songTitle,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    rejectedAt: null,
    rejectionComment: null,
  };

  const result = await db.collection<SongQueueEntry>(COLLECTION).insertOne(entry);
  return { ...entry, _id: result.insertedId };
}

// ─── Check username availability ────────────────────────────────
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const db = await getMongoDb();
  const existing = await db
    .collection<SongQueueEntry>(COLLECTION)
    .findOne({ username: username.toLowerCase().trim() });
  return !existing;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getSongQueueByEmail(email: string): Promise<SongQueueEntry | null> {
  const db = await getMongoDb();
  const normalizedEmail = email.trim();

  return db.collection<SongQueueEntry>(COLLECTION).findOne(
    {
      email: {
        $regex: `^${escapeRegex(normalizedEmail)}$`,
        $options: "i",
      },
    },
    { sort: { createdAt: -1 } },
  );
}

// ─── List (admin) ──────────────────────────────────────────────
export async function listSongQueue(options: {
  status?: SongQueueStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 1 | -1;
  page?: number;
  limit?: number;
} = {}): Promise<SongQueueEntry[]> {
  const {
    status,
    search,
    sortBy = "createdAt",
    sortOrder = -1,
    page = 1,
    limit = 20,
  } = options;

  const db = await getMongoDb();
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    filter.$or = [
      { username: searchRegex },
      { email: searchRegex },
      { lyrics: searchRegex },
      { songTitle: searchRegex },
    ];
  }

  return db
    .collection<SongQueueEntry>(COLLECTION)
    .find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
}

export async function getSongQueueCount(options: {
  status?: SongQueueStatus;
  search?: string;
} = {}): Promise<number> {
  const { status, search } = options;
  const db = await getMongoDb();
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    filter.$or = [
      { username: searchRegex },
      { email: searchRegex },
      { lyrics: searchRegex },
      { songTitle: searchRegex },
    ];
  }
  return db.collection(COLLECTION).countDocuments(filter);
}

// ─── Get by songId ─────────────────────────────────────────────
export async function getSongQueueBySongId(
  songId: string,
): Promise<SongQueueEntry | null> {
  const db = await getMongoDb();
  return db.collection<SongQueueEntry>(COLLECTION).findOne({ songId });
}

// ─── Get by _id ────────────────────────────────────────────────
export async function getSongQueueById(
  id: string,
): Promise<SongQueueEntry | null> {
  const db = await getMongoDb();
  return db
    .collection<SongQueueEntry>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

// ─── Mark completed ────────────────────────────────────────────
export async function markSongCompleted(
  id: string,
  songUrl: string,
): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection<SongQueueEntry>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "completed",
        songUrl,
        updatedAt: now,
        completedAt: now,
        rejectedAt: null,
        rejectionComment: null,
      },
    },
  );
}

// ─── Mark rejected ─────────────────────────────────────────────
export async function markSongRejected(
  id: string,
  rejectionComment?: string,
): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection<SongQueueEntry>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "rejected",
        updatedAt: now,
        rejectedAt: now,
        rejectionComment: rejectionComment?.trim() || null,
      },
    },
  );
}

// ─── Save Direct Song (Authenticated) ──────────────────────────
export async function saveDirectSong(data: {
  userId: string;
  email: string;
  username: string;
  lyrics: string;
  genre: string | null;
  mood: string | null;
  duration: number;
  audioUrl: string;
  promptTags: string;
}): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  const songId = generateSongId();
  const songTitle = [data.genre, data.mood].filter(Boolean).join(" ") || "AI Generated Song";

  const entry: SongQueueEntry = {
    lyrics: data.lyrics,
    theme: null,
    genre: data.genre,
    mood: data.mood,
    duration: data.duration,
    email: data.email,
    username: data.username.toLowerCase().trim(),
    status: "completed",
    promptTags: data.promptTags,
    songUrl: data.audioUrl,
    songId,
    songTitle,
    createdAt: now,
    updatedAt: now,
    completedAt: now,
    rejectedAt: null,
    rejectionComment: null,
  };

  await db.collection<SongQueueEntry>(COLLECTION).insertOne(entry);
}

// ─── List completed (for /explore) ─────────────────────────────
export async function listCompletedSongs(options: {
  search?: string;
  genre?: string;
  mood?: string;
  page?: number;
  limit?: number;
}): Promise<SongQueueEntry[]> {
  const db = await getMongoDb();
  const { search, genre, mood, page = 1, limit = 20 } = options;

  const filter: Record<string, any> = { status: "completed" };

  if (search) {
    const searchRegex = new RegExp(search.toLowerCase().trim(), "i");
    filter.$or = [
      { username: searchRegex },
      { songTitle: searchRegex },
    ];
  }

  if (genre && genre !== "All") filter.genre = genre;
  if (mood && mood !== "All") filter.mood = mood;

  return db
    .collection<SongQueueEntry>(COLLECTION)
    .find(filter)
    .sort({ completedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
}

export async function countCompletedSongs(options: {
  search?: string;
  genre?: string;
  mood?: string;
}): Promise<number> {
  const db = await getMongoDb();
  const { search, genre, mood } = options;

  const filter: Record<string, any> = { status: "completed" };

  if (search) {
    const searchRegex = new RegExp(search.toLowerCase().trim(), "i");
    filter.$or = [
      { username: searchRegex },
      { songTitle: searchRegex },
    ];
  }

  if (genre && genre !== "All") filter.genre = genre;
  if (mood && mood !== "All") filter.mood = mood;

  return db.collection(COLLECTION).countDocuments(filter);
}

// ─── Get User Songs (Authenticated) ──────────────────────────
export async function getUserSongs(email: string, limit = 24): Promise<SongQueueEntry[]> {
  const db = await getMongoDb();
  return db
    .collection<SongQueueEntry>(COLLECTION)
    .find({ 
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
      status: "completed" 
    })
    .sort({ completedAt: -1 })
    .limit(limit)
    .toArray();
}
