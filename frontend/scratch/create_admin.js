const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');

// Simple .env parser
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[key] = value;
  }
});

const email = "songifyadmin@songify.fun";
const password = "songifyadminpassword1234";
const fullName = "Songify Admin";

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
const passwordHash = `${salt}:${hash}`;

async function run() {
  const uri = envVars.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI in .env");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(envVars.MONGODB_DB || "songify");
    
    const userId = crypto.randomUUID();
    const now = new Date();
    
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      console.log("Admin user already exists. Updating password and role...");
      await db.collection("users").updateOne({ email }, {
        $set: { passwordHash, role: "admin", isVerified: true, updatedAt: now }
      });
      console.log("Admin user updated!");
    } else {
      await db.collection("users").insertOne({
        userId,
        email,
        fullName,
        passwordHash,
        role: "admin",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log("Admin user created!");
    }
  } finally {
    await client.close();
  }
}

run().catch(console.error);
