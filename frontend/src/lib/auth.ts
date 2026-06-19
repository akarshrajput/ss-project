import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getMongoDb } from "@/lib/mongodb";

const secretKey = process.env.JWT_SECRET || "fallback-secret-key-for-dev-only-change-in-prod";
const encodedKey = new TextEncoder().encode(secretKey);

export interface UserProfile {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    name?: string;
  };
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

export async function signJwt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encodedKey);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload || !payload.userId) return null;

  try {
    const db = await getMongoDb();
    const userProfile = await db.collection("users").findOne({ userId: payload.userId as string });
    if (!userProfile) return null;

    return {
      id: userProfile.userId,
      email: userProfile.email || "",
      user_metadata: {
        full_name: userProfile.fullName || "",
      },
    };
  } catch (e) {
    console.error("Error fetching user in getUser:", e);
    return null;
  }
}

export async function signInWithPassword({ email, password }: any) {
  try {
    const db = await getMongoDb();
    const normalizedEmail = email.toLowerCase().trim();
    const userProfile = await db.collection("users").findOne({ email: normalizedEmail });
    
    if (!userProfile || !userProfile.passwordHash) {
      return { user: null, session: null, error: { message: "Invalid login credentials" } };
    }

    const isValid = verifyPassword(password, userProfile.passwordHash);
    if (!isValid) {
      return { user: null, session: null, error: { message: "Invalid login credentials" } };
    }

    const token = await signJwt({ userId: userProfile.userId });
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    const user: UserProfile = {
      id: userProfile.userId,
      email: userProfile.email || "",
      user_metadata: {
        full_name: userProfile.fullName || "",
      },
    };

    return { user, session: { access_token: token }, error: null };
  } catch (e) {
    console.error("Error in signInWithPassword:", e);
    return { user: null, session: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

export async function signUp({ email, password, options }: any) {
  try {
    const db = await getMongoDb();
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return { user: null, session: null, error: { message: "User already exists" } };
    }

    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);
    const fullName = options?.data?.full_name || email.split("@")[0];

    const now = new Date();
    await db.collection("users").insertOne({
      userId,
      email: normalizedEmail,
      fullName,
      passwordHash,
      role: "user",
      isVerified: true, // Default verified on register
      createdAt: now,
      updatedAt: now,
    });

    const user: UserProfile = {
      id: userId,
      email: normalizedEmail,
      user_metadata: {
        full_name: fullName,
      },
    };

    const token = await signJwt({ userId });
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return { user, session: { access_token: token }, error: null };
  } catch (e) {
    console.error("Error in signUp:", e);
    return { user: null, session: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");
    return { error: null };
  } catch (e) {
    console.error("Error in signOut:", e);
    return { error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

export async function updateUser({ password }: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (!token) return { user: null, error: { message: "Not authenticated" } };

    const payload = await verifyJwt(token);
    if (!payload || !payload.userId) return { user: null, error: { message: "Invalid session" } };

    const db = await getMongoDb();
    
    if (password) {
      const passwordHash = hashPassword(password);
      await db.collection("users").updateOne(
        { userId: payload.userId as string },
        { $set: { passwordHash, updatedAt: new Date() } }
      );
    }

    const userProfile = await db.collection("users").findOne({ userId: payload.userId as string });
    if (!userProfile) return { user: null, error: { message: "User not found" } };

    const user: UserProfile = {
      id: userProfile.userId,
      email: userProfile.email || "",
      user_metadata: {
        full_name: userProfile.fullName || "",
      },
    };

    return { user, error: null };
  } catch (e) {
    console.error("Error in updateUser:", e);
    return { user: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

export async function signInWithGoogle({ email, name }: { email: string; name: string }) {
  try {
    const db = await getMongoDb();
    const normalizedEmail = email.toLowerCase().trim();
    let userProfile = await db.collection("users").findOne({ email: normalizedEmail });
    
    if (!userProfile) {
      // User doesn't exist, create a new one
      const userId = crypto.randomUUID();
      const now = new Date();
      await db.collection("users").insertOne({
        userId,
        email: normalizedEmail,
        fullName: name,
        role: "user",
        isVerified: true,
        authProvider: "google",
        createdAt: now,
        updatedAt: now,
      });
      userProfile = await db.collection("users").findOne({ userId });
    }

    if (!userProfile) {
      return { user: null, session: null, error: { message: "Failed to create user profile" } };
    }

    const token = await signJwt({ userId: userProfile.userId });
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    const user: UserProfile = {
      id: userProfile.userId,
      email: userProfile.email || "",
      user_metadata: {
        full_name: userProfile.fullName || "",
      },
    };

    return { user, session: { access_token: token }, error: null };
  } catch (e) {
    console.error("Error in signInWithGoogle:", e);
    return { user: null, session: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

