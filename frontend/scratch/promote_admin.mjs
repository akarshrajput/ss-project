import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { MongoClient } from "mongodb";

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

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("Error: MONGODB_URI is missing from .env");
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function promoteAdmin(email, password) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("songify"); // Update DB name if needed based on connection string
    
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail });

    const passwordHash = hashPassword(password);
    const now = new Date();

    if (existingUser) {
      console.log(`User ${email} found. Promoting to admin and updating password...`);
      await db.collection("users").updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            role: "admin", 
            passwordHash,
            updatedAt: now 
          } 
        }
      );
      console.log(`User ${email} (ID: ${existingUser.userId}) is now an Admin.`);
    } else {
      console.log(`User ${email} not found. Creating new admin user...`);
      const userId = crypto.randomUUID();
      await db.collection("users").insertOne({
        userId,
        email: normalizedEmail,
        fullName: "Admin",
        passwordHash,
        role: "admin",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`User ${email} (ID: ${userId}) created as an Admin.`);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

promoteAdmin("admin@songify.fun", "pRh='x8#D{35");
