import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB ?? "songify";

let cachedClient: MongoClient | null = null;
let cachedClientPromise: Promise<MongoClient> | null = null;

function createMongoClient() {
  if (!mongoUri) {
    throw new Error("Missing MongoDB environment value MONGODB_URI.");
  }

  cachedClient ??= new MongoClient(mongoUri);

  return cachedClient.connect();
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