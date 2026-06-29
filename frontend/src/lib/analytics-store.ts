import { getMongoDb } from "@/lib/mongodb";

export type AnalyticsStatus = "started" | "email_viewed" | "completed";

export type SessionAnalytics = {
  sessionId: string;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number;
  basePrompt: string | null;
  email: string | null;
  status: AnalyticsStatus;
  country: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "generatorAnalytics";

// ─── Track / Upsert Event ──────────────────────────────────────────
export async function trackSessionEvent(data: {
  sessionId: string;
  status: AnalyticsStatus;
  lyrics?: string;
  theme?: string | null;
  genre?: string | null;
  mood?: string | null;
  duration?: number;
  basePrompt?: string | null;
  email?: string | null;
  country?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();

  const updateFields: Partial<SessionAnalytics> = {
    status: data.status,
    updatedAt: now,
  };

  if (data.lyrics !== undefined) updateFields.lyrics = data.lyrics;
  if (data.theme !== undefined) updateFields.theme = data.theme;
  if (data.genre !== undefined) updateFields.genre = data.genre;
  if (data.mood !== undefined) updateFields.mood = data.mood;
  if (data.duration !== undefined) updateFields.duration = data.duration;
  if (data.basePrompt !== undefined) updateFields.basePrompt = data.basePrompt;
  if (data.email !== undefined) updateFields.email = data.email;
  if (data.country !== undefined) updateFields.country = data.country;
  if (data.userAgent !== undefined) updateFields.userAgent = data.userAgent;

  const setOnInsertFields: Record<string, any> = {
    createdAt: now,
  };

  if (data.lyrics === undefined) setOnInsertFields.lyrics = "";
  if (data.theme === undefined) setOnInsertFields.theme = null;
  if (data.genre === undefined) setOnInsertFields.genre = null;
  if (data.mood === undefined) setOnInsertFields.mood = null;
  if (data.duration === undefined) setOnInsertFields.duration = 30;
  if (data.basePrompt === undefined) setOnInsertFields.basePrompt = null;
  if (data.email === undefined) setOnInsertFields.email = null;
  if (data.country === undefined) setOnInsertFields.country = "Unknown";
  if (data.userAgent === undefined) setOnInsertFields.userAgent = null;

  await db.collection<SessionAnalytics>(COLLECTION).updateOne(
    { sessionId: data.sessionId },
    {
      $set: updateFields,
      $setOnInsert: setOnInsertFields as any,
    },
    { upsert: true }
  );
}

// ─── Query Statistics (Funnel Dashboard) ───────────────────────────
export async function getAnalyticsStats() {
  const db = await getMongoDb();
  const collection = db.collection<SessionAnalytics>(COLLECTION);

  // Total sessions
  const totalStarted = await collection.countDocuments({});

  // Proceeded to email
  const proceededToEmail = await collection.countDocuments({
    status: { $in: ["email_viewed", "completed"] },
  });

  // Completed sessions
  const completed = await collection.countDocuments({ status: "completed" });

  // Drop offs before email (Step 1)
  const dropoffCustomize = await collection.countDocuments({ status: "started" });

  // Drop offs at email step (Step 2)
  const dropoffEmail = await collection.countDocuments({ status: "email_viewed" });

  // Total drop offs
  const totalDropoffs = dropoffCustomize + dropoffEmail;

  // Conversion rates
  const conversionRate = totalStarted > 0 ? Math.round((completed / totalStarted) * 100) : 0;
  const emailProceedRate = totalStarted > 0 ? Math.round((proceededToEmail / totalStarted) * 100) : 0;
  const emailSubmitRate = proceededToEmail > 0 ? Math.round((completed / proceededToEmail) * 100) : 0;

  // Retrieve recent abandoned sessions (drop-offs)
  const recentAbandoned = await collection
    .find({ status: { $in: ["started", "email_viewed"] } })
    .sort({ updatedAt: -1 })
    .limit(50)
    .toArray();

  return {
    totalStarted,
    proceededToEmail,
    completed,
    dropoffCustomize,
    dropoffEmail,
    totalDropoffs,
    conversionRate,
    emailProceedRate,
    emailSubmitRate,
    recentAbandoned,
  };
}

// ─── Query Rich Analytics Dashboard Data ───────────────────────────
export type PageviewRecord = {
  pathname: string;
  referrer: string;
  sessionId: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  createdAt: Date;
};

const PAGEVIEWS_COLLECTION = "pageviews";

export async function trackPageview(data: {
  pathname: string;
  referrer: string;
  sessionId: string;
  country: string;
  browser: string;
  os: string;
  device: string;
}): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();

  const record: PageviewRecord = {
    pathname: data.pathname,
    referrer: data.referrer || "direct",
    sessionId: data.sessionId,
    country: data.country || "Unknown",
    browser: data.browser || "Unknown",
    os: data.os || "Unknown",
    device: data.device || "Desktop",
    createdAt: now,
  };

  await db.collection<PageviewRecord>(PAGEVIEWS_COLLECTION).insertOne(record);
}

export async function getRichAnalyticsData(range = "7d") {
  const db = await getMongoDb();
  const collection = db.collection<PageviewRecord>(PAGEVIEWS_COLLECTION);

  const now = new Date();
  let startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  if (range === "24h") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (range === "1y") {
    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // 1. Live users count (unique sessions active in last 5 minutes)
  const liveUsers = await collection.distinct("sessionId", {
    createdAt: { $gte: fiveMinsAgo }
  });
  const liveUsersCount = liveUsers.length;

  // 2. Aggregate stats (total pageviews, unique visitors in the FILTERED range)
  const totalPageviews = await collection.countDocuments({
    createdAt: { $gte: startDate }
  });
  const uniqueVisitorsList = await collection.distinct("sessionId", {
    createdAt: { $gte: startDate }
  });
  const totalUniqueVisitors = uniqueVisitorsList.length;

  // Match condition for all sub-queries
  const rangeMatch = { $match: { createdAt: { $gte: startDate } } };

  // 3. Top visited pages (pathnames)
  const topPages = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$pathname",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();

  // 4. Top Referrers
  const topReferrers = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$referrer",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();

  // 5. Top Countries
  const topCountries = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$country",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]).toArray();

  // 6. Top Browsers
  const topBrowsers = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]).toArray();

  // 7. Top OS
  const topOS = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]).toArray();

  // 8. Top Devices
  const topDevices = await collection.aggregate([
    rangeMatch,
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();

  // 9. Trend data depending on range
  let trendPoints = [];
  if (range === "24h") {
    // Group by hour
    const hourlyTrend = await collection.aggregate([
      rangeMatch,
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" }
          },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" }
        }
      },
      {
        $project: {
          _id: 1,
          pageviews: 1,
          visitors: { $size: "$visitors" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Fill in missing hours
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0] + " " + d.toTimeString().split(':')[0] + ":00";
      const match = hourlyTrend.find(t => t._id === dateStr);
      trendPoints.push({
        date: dateStr,
        sessions: match ? match.pageviews : 0,
        completed: match ? match.visitors : 0,
      });
    }
  } else if (range === "7d") {
    // Group by day (last 7 days)
    const dailyTrend = await collection.aggregate([
      rangeMatch,
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" }
        }
      },
      {
        $project: {
          _id: 1,
          pageviews: 1,
          visitors: { $size: "$visitors" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = dailyTrend.find(t => t._id === dateStr);
      trendPoints.push({
        date: dateStr,
        sessions: match ? match.pageviews : 0,
        completed: match ? match.visitors : 0,
      });
    }
  } else if (range === "30d") {
    // Group by day (last 30 days)
    const dailyTrend = await collection.aggregate([
      rangeMatch,
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" }
        }
      },
      {
        $project: {
          _id: 1,
          pageviews: 1,
          visitors: { $size: "$visitors" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = dailyTrend.find(t => t._id === dateStr);
      trendPoints.push({
        date: dateStr,
        sessions: match ? match.pageviews : 0,
        completed: match ? match.visitors : 0,
      });
    }
  } else if (range === "1y") {
    // Group by month (last 12 months)
    const monthlyTrend = await collection.aggregate([
      rangeMatch,
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" }
        }
      },
      {
        $project: {
          _id: 1,
          pageviews: 1,
          visitors: { $size: "$visitors" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const dateStr = d.toISOString().split('T')[0].substring(0, 7);
      const match = monthlyTrend.find(t => t._id === dateStr);
      trendPoints.push({
        date: dateStr,
        sessions: match ? match.pageviews : 0,
        completed: match ? match.visitors : 0,
      });
    }
  }

  // 10. Recent event logs (recent visitor paths - within the range)
  const recentEvents = await collection
    .find({ createdAt: { $gte: startDate } })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  return {
    liveUsers: liveUsersCount,
    totalSessions: totalPageviews, // total pageviews
    emailViewed: totalUniqueVisitors, // unique visitors
    completed: totalUniqueVisitors, // unique visitors
    topCountries: topCountries.map(c => ({ country: c._id, count: c.count })),
    topPages: topPages.map(p => ({ pathname: p._id, count: p.count })),
    topReferrers: topReferrers.map(r => ({ referrer: r._id, count: r.count })),
    topBrowsers: topBrowsers.map(b => ({ browser: b._id, count: b.count })),
    topOS: topOS.map(o => ({ os: o._id, count: o.count })),
    topDevices: topDevices.map(d => ({ device: d._id, count: d.count })),
    dailyTrend: trendPoints,
    recentEvents: recentEvents.map(e => ({
      sessionId: e.sessionId,
      lyrics: e.pathname, // map pathname to lyrics field (so we don't break types)
      status: "pageview", // hardcoded status
      country: e.country,
      updatedAt: e.createdAt.toISOString(),
      genre: e.browser, // map browser to genre
      mood: e.device, // map device to mood
    })),
  };
}

export type VisitorDetail = {
  sessionId: string;
  country: string;
  browser: string;
  device: string;
  os: string;
  routesVisited: { pathname: string; count: number }[];
  totalPageviews: number;
  lastActive: string;
  accountCreated: boolean;
  hasPremium: boolean;
};

export async function getPaginatedVisitorsAnalytics(
  page = 1,
  limit = 10,
  range = "7d"
) {
  const db = await getMongoDb();
  const pageviewsCol = db.collection<PageviewRecord>(PAGEVIEWS_COLLECTION);
  const generatorCol = db.collection<SessionAnalytics>("generatorAnalytics");
  const usersCol = db.collection("users");
  const subscriptionsCol = db.collection("subscriptions");

  const now = new Date();
  let startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  if (range === "24h") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (range === "1y") {
    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  const rangeMatch = { $match: { createdAt: { $gte: startDate } } };

  // Aggregate unique sessions with their paths and max createdAt
  const aggregationPipeline = [
    rangeMatch,
    {
      $group: {
        _id: "$sessionId",
        totalPageviews: { $sum: 1 },
        routes: { $push: "$pathname" },
        country: { $last: "$country" },
        browser: { $last: "$browser" },
        device: { $last: "$device" },
        os: { $last: "$os" },
        lastActive: { $max: "$createdAt" }
      }
    },
    { $sort: { lastActive: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
      }
    }
  ];

  const [result] = await pageviewsCol.aggregate(aggregationPipeline).toArray();
  const total = result.metadata[0]?.total || 0;
  const data = result.data || [];

  const enrichedData: VisitorDetail[] = await Promise.all(
    data.map(async (v: { _id: string; routes: string[]; country?: string; browser?: string; device?: string; os?: string; totalPageviews: number; lastActive: Date }) => {
      // Calculate route counts
      const routeCounts = v.routes.reduce((acc: Record<string, number>, curr: string) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const routesVisited = Object.entries(routeCounts).map(([pathname, count]) => ({
        pathname,
        count: count as number,
      }));

      let accountCreated = false;
      let hasPremium = false;

      // Check generatorAnalytics for email
      const sessionEvent = await generatorCol.findOne({ sessionId: v._id });
      if (sessionEvent) {
        if (sessionEvent.status === "completed") {
          accountCreated = true;
        }

        if (sessionEvent.email) {
          // Check users collection
          const user = await usersCol.findOne({ email: sessionEvent.email });
          if (user) {
            accountCreated = true;
            // Check subscriptions collection
            const sub = await subscriptionsCol.findOne({
              userId: user.userId,
              status: "active",
              expiresAt: { $gt: now }
            });
            if (sub) {
              hasPremium = true;
            }
          }
        }
      }

      return {
        sessionId: v._id,
        country: v.country || "Unknown",
        browser: v.browser || "Unknown",
        device: v.device || "Unknown",
        os: v.os || "Unknown",
        routesVisited,
        totalPageviews: v.totalPageviews,
        lastActive: v.lastActive.toISOString(),
        accountCreated,
        hasPremium
      };
    })
  );

  return {
    data: enrichedData,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}
