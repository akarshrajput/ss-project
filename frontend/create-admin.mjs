import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Read .env file for MongoDB URI
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    acc[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return acc;
}, {});

const MONGODB_URI = envVars['MONGODB_URI'];
const MONGODB_DB = envVars['MONGODB_DB_NAME'] ?? envVars['MONGODB_DB'] ?? "singify";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function createAdminUser() {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    const email = "admin@singify.fun";
    const password = "@akarshrajput2003R";
    const passwordHash = hashPassword(password);
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    let userId;
    
    if (existingUser) {
      console.log("User already exists. Updating role to admin and setting password.");
      userId = existingUser.userId;
      await db.collection('users').updateOne(
        { email },
        { 
          $set: { 
            passwordHash,
            role: "admin",
            isVerified: true,
            updatedAt: new Date()
          } 
        }
      );
    } else {
      console.log("Creating new admin user...");
      userId = crypto.randomUUID();
      const now = new Date();
      await db.collection('users').insertOne({
        userId,
        email,
        fullName: "Admin",
        passwordHash,
        role: "admin",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log("User setup complete. Setting up lifetime subscription...");

    // Create a lifetime subscription
    await db.collection('subscriptions').deleteMany({ userId });

    const now = new Date();
    // Expiration date in 100 years
    const expiresAt = new Date();
    expiresAt.setFullYear(now.getFullYear() + 100);

    const subscription = {
      userId,
      plan: "lifetime-premium",
      stripeSessionId: "admin_lifetime_" + crypto.randomUUID(),
      stripePaymentIntentId: "admin_lifetime",
      amount: 0,
      currency: "usd",
      status: "active",
      startsAt: now,
      expiresAt,
      createdAt: now,
    };

    await db.collection('subscriptions').insertOne(subscription);
    
    console.log("Successfully created/updated admin user with lifetime premium in db:", MONGODB_DB);
    console.log(`Email: ${email}`);

  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    await client.close();
  }
}

createAdminUser();
