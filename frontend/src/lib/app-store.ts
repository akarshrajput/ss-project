import type { User } from "@supabase/supabase-js";
import { getMongoDb, getMongoDbOrNull, isMongoConfigured } from "@/lib/mongodb";

export const DEFAULT_COMFYUI_URL = "https://e54wgks2f9mg8n-7865.proxy.runpod.net";

export type AppUserRole = "user" | "admin";

export type AppUserProfile = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: AppUserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AppSettings = {
  key: "app";
  comfyUiUrl: string | null;
  updatedAt: Date;
  updatedBy: string | null;
};

function normalizeUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

function buildComfyUiHealthUrl(baseUrl: string) {
  return new URL("system_stats", `${normalizeUrl(baseUrl)}/`).toString();
}

function readFullName(user: Pick<User, "email" | "user_metadata">) {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    "";

  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email.split("@")[0] ?? null;
  }

  return null;
}

export async function upsertAppUserProfile(user: User, isVerified: boolean = true) {
  const db = await getMongoDbOrNull();

  if (!db) {
    return;
  }

  const now = new Date();

  await db.collection<AppUserProfile>("users").updateOne(
    { userId: user.id },
    {
      $set: {
        email: user.email ?? null,
        fullName: readFullName(user),
        updatedAt: now,
      },
      $setOnInsert: {
        userId: user.id,
        role: "user",
        isVerified,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getAppUserProfile(userId: string) {
  const db = await getMongoDbOrNull();

  if (!db) {
    return null;
  }

  return db.collection<AppUserProfile>("users").findOne({ userId });
}

export async function listAppUserProfiles() {
  const db = await getMongoDbOrNull();

  if (!db) {
    return [];
  }

  return db.collection<AppUserProfile>("users").find({}).sort({ createdAt: -1 }).toArray();
}

export async function setAppUserRole(userId: string, role: AppUserRole) {
  if (!isMongoConfigured()) {
    throw new Error("Missing MongoDB environment value MONGODB_URI.");
  }

  const db = await getMongoDb();
  const now = new Date();

  await db.collection<AppUserProfile>("users").updateOne(
    { userId },
    {
      $set: {
        role,
        updatedAt: now,
      },
      $setOnInsert: {
        userId,
        email: null,
        fullName: null,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getAppSettings() {
  const db = await getMongoDbOrNull();

  if (!db) {
    return {
      comfyUiUrl: DEFAULT_COMFYUI_URL,
      updatedAt: null,
      updatedBy: null,
    };
  }

  const settings = await db.collection<AppSettings>("settings").findOne({ key: "app" });

  return {
    comfyUiUrl: settings?.comfyUiUrl ?? DEFAULT_COMFYUI_URL,
    updatedAt: settings?.updatedAt ?? null,
    updatedBy: settings?.updatedBy ?? null,
  };
}

export async function getComfyUiBaseUrl() {
  const settings = await getAppSettings();
  return normalizeUrl(settings.comfyUiUrl);
}

export async function isComfyUiOnline(baseUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(buildComfyUiHealthUrl(baseUrl), {
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getComfyUiOnline() {
  const baseUrl = await getComfyUiBaseUrl();
  return isComfyUiOnline(baseUrl);
}

export async function setComfyUiBaseUrl(comfyUiUrl: string, updatedBy: string) {
  if (!isMongoConfigured()) {
    throw new Error("Missing MongoDB environment value MONGODB_URI.");
  }

  const db = await getMongoDb();
  const now = new Date();

  await db.collection<AppSettings>("settings").updateOne(
    { key: "app" },
    {
      $set: {
        comfyUiUrl: normalizeUrl(comfyUiUrl),
        updatedAt: now,
        updatedBy,
      },
      $setOnInsert: {
        key: "app",
      },
    },
    { upsert: true },
  );
}

import crypto from "crypto";

export type EmailOtp = {
  _id?: any;
  userId?: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  payload?: string; // encrypted JSON payload
};

const ENCRYPTION_KEY = process.env.STRIPE_SECRET_KEY 
  ? process.env.STRIPE_SECRET_KEY.slice(0, 32).padEnd(32, '0') 
  : "12345678901234567890123456789012";

function encryptPayload(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptPayload(text: string): string {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function createEmailOtp(userId: string | undefined, email: string, payload?: any): Promise<string> {
  const db = await getMongoDb();
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
  
  const doc: EmailOtp = {
    email,
    otp,
    expiresAt,
    createdAt: now,
  };

  if (userId) doc.userId = userId;
  if (payload) {
    doc.payload = encryptPayload(JSON.stringify(payload));
  }

  // Delete any existing OTPs for this email to prevent spam
  await db.collection<EmailOtp>("email_otps").deleteMany({ email });

  await db.collection<EmailOtp>("email_otps").insertOne(doc);

  return otp;
}

export async function verifyEmailOtp(email: string, otp: string): Promise<any | boolean> {
  const db = await getMongoDb();
  const now = new Date();

  const record = await db.collection<EmailOtp>("email_otps").findOne({
    email,
    otp,
    expiresAt: { $gt: now }
  });

  if (record) {
    if (record.userId) {
      await db.collection<AppUserProfile>("users").updateOne(
        { userId: record.userId },
        { $set: { isVerified: true, updatedAt: now } }
      );
    }
    
    await db.collection<EmailOtp>("email_otps").deleteOne({ _id: record._id });
    
    if (record.payload) {
      try {
        return JSON.parse(decryptPayload(record.payload));
      } catch (e) {
        return true;
      }
    }
    return true;
  }

  return false;
}
