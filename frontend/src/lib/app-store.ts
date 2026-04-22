import type { User } from "@supabase/supabase-js";
import { getMongoDb } from "@/lib/mongodb";

export const DEFAULT_COMFYUI_URL = "https://e54wgks2f9mg8n-7865.proxy.runpod.net";

export type AppUserRole = "user" | "admin";

export type AppUserProfile = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: AppUserRole;
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

export async function upsertAppUserProfile(user: User) {
  const db = await getMongoDb();
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
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getAppUserProfile(userId: string) {
  const db = await getMongoDb();
  return db.collection<AppUserProfile>("users").findOne({ userId });
}

export async function listAppUserProfiles() {
  const db = await getMongoDb();
  return db.collection<AppUserProfile>("users").find({}).sort({ createdAt: -1 }).toArray();
}

export async function setAppUserRole(userId: string, role: AppUserRole) {
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
        role,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getAppSettings() {
  const db = await getMongoDb();
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