import { getMongoDb } from "../src/lib/mongodb.ts";

const COLLECTION = "generatorAnalytics";

const MOCK_LYRICS_STARTED = [
  "Golden lights are dancing in the midnight rain\nI wrote your name into the chorus again\nEvery broken memory turns into a spark",
  "Lost in the waves of a digital dreams\nNothing is quite what it seems\nBut I still hear your voice through the static...",
  "Running through the streets at 3 AM\nWondering if we could be friends again\nOr if this is really the end.",
  "Coffee cups and paperbacks on the floor\nI don't think I can love you anymore\nBut I'll keep writing songs about the door.",
  "Beat drops low, hands up high\nWe own the summer sky\nLet the bassline take us away...",
  "Heavy heart and a suitcase full of stones\nWalking down these empty roads alone\nBut I'm finally finding my way home.",
  "Electric sparks and neon blue\nI'm still thinking about you\nUnderneath the shadow of the moon.",
  "Visions of a castle in the sand\nHolding onto your warm hand\nIn a place we don't understand.",
  "Screaming out the window of a fast car\nWe didn't know we'd get this far\nBut now we're wishing on a dying star.",
  "Sunsets and ocean breeze\nWhispers in the autumn trees\nBring me back to my knees."
];

const MOCK_LYRICS_EMAIL_VIEWED = [
  "Another midnight, another empty page\nAct like a actor on a forgotten stage\nI'm turning the keys to unlock this rusty cage.",
  "We were fire and gasoline\nThe prettiest mess you've ever seen\nNow we're just characters on a movie screen.",
  "Bass drums thump in the dark room\nSmoke rising like a wild bloom\nWe won't stop until the crack of doom.",
  "Gentle acoustic guitar strumming slow\nWatching the winter river flow\nWhere do the memories go when the cold winds blow?",
  "Cyberpunk streets and synthetic rain\nTrying to wash away all of the pain\nBut the neon lights keep driving me insane.",
  "Whispers in the library hallway\nWe promised we would stay always\nNow you're a million miles away."
];

const MOCK_LYRICS_COMPLETED = [
  "Starlight and silver skies\nLooking into your deep green eyes\nNo more games, no more lies.",
  "Upbeat pop song about a happy dog\nRunning through the summer morning fog\nChasing tennis balls and jumping over logs!",
  "Heavy metal guitars shredding bright\nFighting the monsters in the night\nWith all of our power and might!",
  "Lo-fi beats for a lazy sunday afternoon\nWatching the shadows dance across the room\nHope the rain doesn't start too soon.",
  "R&B groove about a second chance\nTaking you out for one last dance\nReigniting our old romance."
];

const MOODS = ["Happy", "Sad", "Energetic", "Calm", "Dreamy", "Upbeat"];
const GENRES = ["Pop", "Rock", "Hip-Hop", "R&B", "Lo-fi", "EDM"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function seed() {
  try {
    const db = await getMongoDb();
    console.log("Connected to MongoDB. Clearing existing analytics logs...");
    await db.collection(COLLECTION).deleteMany({});

    console.log("Seeding mock analytics data...");

    const now = Date.now();
    const documents = [];

    // 1. Seed Completed Sessions (Step 3) - 12 sessions
    for (let i = 0; i < 12; i++) {
      const sessionId = generateSessionId();
      const createdAt = new Date(now - (12 - i) * 3600 * 1000 - Math.random() * 1800 * 1000);
      const updatedAt = new Date(createdAt.getTime() + 45 * 1000 + Math.random() * 60 * 1000);
      
      documents.push({
        sessionId,
        lyrics: getRandomItem(MOCK_LYRICS_COMPLETED),
        theme: getRandomItem(["Love", "Nostalgia", "Motivation"]),
        genre: getRandomItem(GENRES),
        mood: getRandomItem(MOODS),
        duration: getRandomItem([15, 30, 60, 120]),
        basePrompt: "vibrant acoustic and sweet vocals",
        email: `user${i}@example.com`,
        status: "completed",
        createdAt,
        updatedAt
      });
    }

    // 2. Seed Email Viewed Sessions (Step 2 Drop-off) - 8 sessions
    for (let i = 0; i < 8; i++) {
      const sessionId = generateSessionId();
      const createdAt = new Date(now - (8 - i) * 2 * 3600 * 1000 - Math.random() * 3600 * 1000);
      const updatedAt = new Date(createdAt.getTime() + 20 * 1000 + Math.random() * 20 * 1000);
      
      documents.push({
        sessionId,
        lyrics: getRandomItem(MOCK_LYRICS_EMAIL_VIEWED),
        theme: getRandomItem(["Heartbreak", "Fantasy", "Nature"]),
        genre: getRandomItem(GENRES),
        mood: getRandomItem(MOODS),
        duration: getRandomItem([30, 60]),
        basePrompt: "synth pads and heavy kicks with robotic atmosphere",
        email: null,
        status: "email_viewed",
        createdAt,
        updatedAt
      });
    }

    // 3. Seed Started Sessions (Step 1 Drop-off) - 15 sessions
    for (let i = 0; i < 15; i++) {
      const sessionId = generateSessionId();
      const createdAt = new Date(now - (15 - i) * 45 * 60 * 1000 - Math.random() * 900 * 1000);
      const updatedAt = new Date(createdAt.getTime() + 2 * 1000 + Math.random() * 8 * 1000);
      
      documents.push({
        sessionId,
        lyrics: getRandomItem(MOCK_LYRICS_STARTED),
        theme: null,
        genre: null,
        mood: null,
        duration: 30,
        basePrompt: null,
        email: null,
        status: "started",
        createdAt,
        updatedAt
      });
    }

    await db.collection(COLLECTION).insertMany(documents);
    console.log(`Successfully seeded ${documents.length} mock generator analytics events!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err.message);
    process.exit(1);
  }
}

seed();
