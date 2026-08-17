import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB ?? "singify";

let cachedClient: MongoClient | null = null;
let cachedClientPromise: Promise<MongoClient> | null = null;

function createMongoClient() {
  if (!mongoUri) {
    throw new Error("Missing MongoDB environment value MONGODB_URI.");
  }

  cachedClient ??= new MongoClient(mongoUri);

  return cachedClient.connect();
}

export function isMongoConfigured() {
  return Boolean(mongoUri);
}

export async function getMongoDbOrNull() {
  if (!isMongoConfigured()) {
    return null;
  }

  try {
    return await getMongoDb();
  } catch (error) {
    console.error("MongoDB connection failed.", error);
    return null;
  }
}

export async function getMongoClient() {
  if (!cachedClientPromise) {
    cachedClientPromise = createMongoClient();
  }

  cachedClient = await cachedClientPromise;
  return cachedClient;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  return client.db(mongoDbName);
}
