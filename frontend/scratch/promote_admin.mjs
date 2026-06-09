import { createClient } from "@supabase/supabase-js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index !== -1) {
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function promoteAdmin(email, password) {
  try {
    console.log(`Attempting to sign in as ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.log(`Sign in failed (${error.message}). Attempting to sign up...`);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: "Admin" } }
      });

      if (signUpError) {
        throw new Error(`Sign up failed: ${signUpError.message}`);
      }
      
      console.log("User signed up successfully.");
      const userId = signUpData.user.id;
      await updateMongo(userId, email);
    } else {
      console.log("Sign in successful.");
      const userId = data.user.id;
      await updateMongo(userId, email);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

async function updateMongo(userId, email) {
  const { getMongoDb } = await import("../src/lib/mongodb.ts");
  const db = await getMongoDb();
  const now = new Date();
  await db.collection("users").updateOne(
    { userId },
    {
      $set: {
        userId,
        email,
        fullName: "Admin",
        role: "admin",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      }
    },
    { upsert: true }
  );
  console.log(`User ${email} (ID: ${userId}) is now an Admin in MongoDB.`);
}

promoteAdmin("admin@songify.fun", "pRh='x8#D{35");
