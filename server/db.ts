import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  offers, 
  InsertOffer, 
  landingPages, 
  InsertLandingPage,
  adCopyVariations,
  InsertAdCopyVariation,
  emailSequences,
  InsertEmailSequence,
  emails,
  InsertEmail,
  performanceMetrics,
  InsertPerformanceMetric,
  nicheStrategies,
  InsertNicheStrategy
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// OFFER MANAGEMENT
// ============================================================================

export async function createOffer(offer: InsertOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(offers).values(offer);
  return result;
}

export async function getOffersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(offers).where(eq(offers.userId, userId)).orderBy(desc(offers.createdAt));
}

export async function getOfferById(offerId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(offers).where(
    and(eq(offers.id, offerId), eq(offers.userId, userId))
  ).limit(1);
  
  return result[0];
}

export async function updateOffer(offerId: number, userId: number, updates: Partial<InsertOffer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(offers).set(updates).where(
    and(eq(offers.id, offerId), eq(offers.userId, userId))
  );
}

export async function deleteOffer(offerId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(offers).where(
    and(eq(offers.id, offerId), eq(offers.userId, userId))
  );
}

// ============================================================================
// LANDING PAGE MANAGEMENT
// ============================================================================

export async function createLandingPage(page: InsertLandingPage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(landingPages).values(page);
  return result;
}

export async function getLandingPagesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(landingPages).where(eq(landingPages.userId, userId)).orderBy(desc(landingPages.createdAt));
}

export async function getLandingPagesByOfferId(offerId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(landingPages).where(
    and(eq(landingPages.offerId, offerId), eq(landingPages.userId, userId))
  ).orderBy(desc(landingPages.createdAt));
}

export async function getLandingPageById(pageId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(landingPages).where(
    and(eq(landingPages.id, pageId), eq(landingPages.userId, userId))
  ).limit(1);
  
  return result[0];
}

export async function updateLandingPage(pageId: number, userId: number, updates: Partial<InsertLandingPage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(landingPages).set(updates).where(
    and(eq(landingPages.id, pageId), eq(landingPages.userId, userId))
  );
}

// ============================================================================
// AD COPY VARIATIONS
// ============================================================================

export async function createAdCopyVariation(variation: InsertAdCopyVariation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adCopyVariations).values(variation);
  return result;
}

export async function getAdCopyVariationsByLandingPageId(landingPageId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(adCopyVariations).where(
    and(eq(adCopyVariations.landingPageId, landingPageId), eq(adCopyVariations.userId, userId))
  ).orderBy(desc(adCopyVariations.createdAt));
}

export async function updateAdCopyVariation(variationId: number, userId: number, updates: Partial<InsertAdCopyVariation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(adCopyVariations).set(updates).where(
    and(eq(adCopyVariations.id, variationId), eq(adCopyVariations.userId, userId))
  );
}

// ============================================================================
// EMAIL SEQUENCES
// ============================================================================

export async function createEmailSequence(sequence: InsertEmailSequence) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(emailSequences).values(sequence);
  return result;
}

export async function getEmailSequencesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(emailSequences).where(eq(emailSequences.userId, userId)).orderBy(desc(emailSequences.createdAt));
}

export async function getEmailSequenceById(sequenceId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(emailSequences).where(
    and(eq(emailSequences.id, sequenceId), eq(emailSequences.userId, userId))
  ).limit(1);
  
  return result[0];
}

export async function createEmail(email: InsertEmail) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(emails).values(email);
  return result;
}

export async function getEmailsBySequenceId(sequenceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(emails).where(eq(emails.sequenceId, sequenceId)).orderBy(emails.dayNumber);
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export async function createPerformanceMetric(metric: InsertPerformanceMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(performanceMetrics).values(metric);
  return result;
}

export async function getPerformanceMetricsByOfferId(offerId: number, userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(performanceMetrics).where(
    and(eq(performanceMetrics.offerId, offerId), eq(performanceMetrics.userId, userId))
  ).orderBy(desc(performanceMetrics.date)).limit(limit);
}

export async function getPerformanceMetricsByUserId(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(performanceMetrics).where(
    eq(performanceMetrics.userId, userId)
  ).orderBy(desc(performanceMetrics.date)).limit(limit);
}

export async function getPerformanceSummaryByOfferId(offerId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    totalImpressions: sql<number>`SUM(${performanceMetrics.impressions})`,
    totalClicks: sql<number>`SUM(${performanceMetrics.clicks})`,
    totalConversions: sql<number>`SUM(${performanceMetrics.conversions})`,
    totalRevenue: sql<number>`SUM(${performanceMetrics.revenue})`,
    totalAdSpend: sql<number>`SUM(${performanceMetrics.adSpend})`,
  }).from(performanceMetrics).where(
    and(eq(performanceMetrics.offerId, offerId), eq(performanceMetrics.userId, userId))
  );
  
  return result[0];
}

// ============================================================================
// NICHE STRATEGIES
// ============================================================================

export async function getNicheStrategiesByNiche(niche: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(nicheStrategies).where(eq(nicheStrategies.niche, niche as any)).orderBy(desc(nicheStrategies.effectiveness));
}

export async function getAllNicheStrategies() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(nicheStrategies).orderBy(nicheStrategies.niche, desc(nicheStrategies.effectiveness));
}

export async function createNicheStrategy(strategy: InsertNicheStrategy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(nicheStrategies).values(strategy);
  return result;
}


// ============================================================================
// VIDEO PROJECTS
// ============================================================================

import { videoProjects, InsertVideoProject, VideoProject } from "../drizzle/schema";

export async function getVideoProjectsByUserId(userId: number): Promise<VideoProject[]> {
  const dbConn = await getDb();
  if (!dbConn) return [];
  
  return dbConn.select().from(videoProjects).where(eq(videoProjects.userId, userId));
}

export async function getVideoProjectById(id: number, userId: number): Promise<VideoProject | undefined> {
  const dbConn = await getDb();
  if (!dbConn) return undefined;
  
  const result = await dbConn
    .select()
    .from(videoProjects)
    .where(eq(videoProjects.id, id))
    .limit(1);
  
  if (result.length === 0 || result[0]!.userId !== userId) {
    return undefined;
  }
  
  return result[0];
}

export async function createVideoProject(data: Omit<InsertVideoProject, "id">): Promise<VideoProject> {
  const dbConn = await getDb();
  if (!dbConn) throw new Error("Database not available");
  
  const result = await dbConn.insert(videoProjects).values(data);
  const insertedId = Number(result[0].insertId);
  
  const created = await getVideoProjectById(insertedId, data.userId);
  if (!created) throw new Error("Failed to retrieve created video project");
  
  return created;
}

export async function updateVideoProject(
  id: number,
  userId: number,
  updates: Partial<Omit<VideoProject, "id" | "userId" | "createdAt">>
): Promise<VideoProject | undefined> {
  const dbConn = await getDb();
  if (!dbConn) return undefined;
  
  // Verify ownership
  const existing = await getVideoProjectById(id, userId);
  if (!existing) return undefined;
  
  await dbConn
    .update(videoProjects)
    .set(updates)
    .where(eq(videoProjects.id, id));
  
  return getVideoProjectById(id, userId);
}

export async function deleteVideoProject(id: number, userId: number): Promise<boolean> {
  const dbConn = await getDb();
  if (!dbConn) return false;
  
  // Verify ownership
  const existing = await getVideoProjectById(id, userId);
  if (!existing) return false;
  
  await dbConn.delete(videoProjects).where(eq(videoProjects.id, id));
  return true;
}
