import { createClient } from "@supabase/supabase-js";
import { getMongoDb } from "../src/lib/mongodb.ts";

const supabaseUrl = "https://wrehkhvdxnpqturqquqr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZWhraHZkeG5wcXR1cnFxdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTIyNzAsImV4cCI6MjA5MTgyODI3MH0.daA_vimLnMebXRsybirGi3BwKEh-ks7CDRTTuB6erEw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function promoteAdmin(email, password) {
  try {
    console.log(`Attempting to sign in as ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.log("Sign in failed. Attempting to sign up...");
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
