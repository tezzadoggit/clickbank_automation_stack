import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * ClickBank offers being tracked and promoted
 */
export const offers = mysqlTable("offers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Basic offer info
  productName: varchar("productName", { length: 255 }).notNull(),
  vendor: varchar("vendor", { length: 255 }).notNull(),
  clickbankId: varchar("clickbankId", { length: 100 }),
  niche: mysqlEnum("niche", ["manifestation", "woodworking", "prepping", "health", "finance", "other"]).notNull(),
  source: mysqlEnum("source", ["clickbank", "custom"]).default("clickbank").notNull(),
  sourceUrl: text("sourceUrl"),
  
  // ClickBank metrics
  gravity: int("gravity"),
  avgEarningsPerSale: int("avgEarningsPerSale"), // in cents
  avgConversionValue: int("avgConversionValue"), // in cents
  commissionRate: int("commissionRate"), // percentage * 100 (e.g., 7500 = 75%)
  rebillRate: int("rebillRate"), // percentage * 100
  
  // Offer details
  salesPageUrl: text("salesPageUrl"),
  affiliatePageUrl: text("affiliatePageUrl"),
  description: text("description"),
  targetAudience: text("targetAudience"),
  
  // Evaluation scores
  evaluationScore: int("evaluationScore"), // 0-100
  recommendationStatus: mysqlEnum("recommendationStatus", ["recommended", "caution", "avoid", "pending"]).default("pending"),
  notes: text("notes"),
  
  // Status
  status: mysqlEnum("status", ["active", "paused", "archived"]).default("active").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = typeof offers.$inferInsert;

/**
 * AI-generated landing pages for offers
 */
export const landingPages = mysqlTable("landingPages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: int("offerId").notNull().references(() => offers.id, { onDelete: "cascade" }),
  
  // Page content
  title: varchar("title", { length: 255 }).notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  bodyCopy: text("bodyCopy").notNull(),
  callToAction: varchar("callToAction", { length: 255 }).notNull(),
  
  // Generated assets
  thumbnailUrl: text("thumbnailUrl"),
  heroImageUrl: text("heroImageUrl"),
  
  // Metadata
  template: varchar("template", { length: 100 }).notNull(),
  niche: mysqlEnum("niche", ["manifestation", "woodworking", "prepping", "health", "finance", "other"]).notNull(),
  
  // Performance tracking
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  
  // Status
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

/**
 * Ad copy variations for A/B testing
 */
export const adCopyVariations = mysqlTable("adCopyVariations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  landingPageId: int("landingPageId").notNull().references(() => landingPages.id, { onDelete: "cascade" }),
  
  // Copy content
  headline: text("headline").notNull(),
  bodyCopy: text("bodyCopy").notNull(),
  callToAction: varchar("callToAction", { length: 255 }).notNull(),
  
  // A/B testing metrics
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  
  // Status
  isControl: int("isControl").default(0).notNull(), // 0 = false, 1 = true
  status: mysqlEnum("status", ["active", "paused", "winner", "archived"]).default("active").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdCopyVariation = typeof adCopyVariations.$inferSelect;
export type InsertAdCopyVariation = typeof adCopyVariations.$inferInsert;

/**
 * Email sequences for lead nurturing
 */
export const emailSequences = mysqlTable("emailSequences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: int("offerId").references(() => offers.id, { onDelete: "set null" }),
  
  // Sequence details
  name: varchar("name", { length: 255 }).notNull(),
  niche: mysqlEnum("niche", ["manifestation", "woodworking", "prepping", "health", "finance", "other"]).notNull(),
  description: text("description"),
  
  // Sequence configuration
  emailCount: int("emailCount").notNull(),
  daysBetweenEmails: int("daysBetweenEmails").default(1).notNull(),
  
  // Status
  status: mysqlEnum("status", ["draft", "active", "paused", "archived"]).default("draft").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailSequence = typeof emailSequences.$inferSelect;
export type InsertEmailSequence = typeof emailSequences.$inferInsert;

/**
 * Individual emails within sequences
 */
export const emails = mysqlTable("emails", {
  id: int("id").autoincrement().primaryKey(),
  sequenceId: int("sequenceId").notNull().references(() => emailSequences.id, { onDelete: "cascade" }),
  
  // Email content
  dayNumber: int("dayNumber").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  preheader: varchar("preheader", { length: 255 }),
  body: text("body").notNull(),
  
  // Performance tracking
  sent: int("sent").default(0).notNull(),
  opened: int("opened").default(0).notNull(),
  clicked: int("clicked").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Email = typeof emails.$inferSelect;
export type InsertEmail = typeof emails.$inferInsert;

/**
 * Performance tracking for offers and campaigns
 */
export const performanceMetrics = mysqlTable("performanceMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: int("offerId").notNull().references(() => offers.id, { onDelete: "cascade" }),
  landingPageId: int("landingPageId").references(() => landingPages.id, { onDelete: "set null" }),
  
  // Date tracking
  date: timestamp("date").notNull(),
  
  // Traffic metrics
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
  
  // Conversion metrics
  conversions: int("conversions").default(0).notNull(),
  revenue: int("revenue").default(0).notNull(), // in cents
  
  // Cost metrics
  adSpend: int("adSpend").default(0).notNull(), // in cents
  
  // Calculated metrics (stored for performance)
  ctr: int("ctr"), // click-through rate * 10000 (e.g., 250 = 2.5%)
  conversionRate: int("conversionRate"), // * 10000
  epc: int("epc"), // earnings per click in cents
  cpc: int("cpc"), // cost per click in cents
  roi: int("roi"), // return on investment * 100
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = typeof performanceMetrics.$inferInsert;

/**
 * Niche-specific strategy library
 */
export const nicheStrategies = mysqlTable("nicheStrategies", {
  id: int("id").autoincrement().primaryKey(),
  
  // Strategy details
  niche: mysqlEnum("niche", ["manifestation", "woodworking", "prepping", "health", "finance", "other"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["hook", "traffic_source", "marketing_angle", "audience_profile", "content_type"]).notNull(),
  
  // Content
  description: text("description").notNull(),
  examples: text("examples"),
  tips: text("tips"),
  
  // Metadata
  effectiveness: int("effectiveness"), // 0-100 rating
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NicheStrategy = typeof nicheStrategies.$inferSelect;
export type InsertNicheStrategy = typeof nicheStrategies.$inferInsert;

export const videoProjects = mysqlTable("videoProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: int("offerId").notNull().references(() => offers.id, { onDelete: "cascade" }),
  
  title: varchar("title", { length: 255 }).notNull(),
  niche: mysqlEnum("niche", ["manifestation", "woodworking", "prepping", "health", "finance", "other"]).notNull(),
  
  script: text("script").notNull(),
  scriptWordCount: int("scriptWordCount"),
  promptTemplate: varchar("promptTemplate", { length: 100 }),
  
  voiceoverUrl: text("voiceoverUrl"),
  voiceId: varchar("voiceId", { length: 100 }),
  voiceName: varchar("voiceName", { length: 100 }),
  
  videoUrl: text("videoUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  duration: int("duration"),
  
  clickmagickUrl: text("clickmagickUrl"),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  utmTerm: varchar("utmTerm", { length: 100 }),
  utmContent: varchar("utmContent", { length: 100 }),
  
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  adSpend: int("adSpend").default(0).notNull(),
  revenue: int("revenue").default(0).notNull(),
  
  status: mysqlEnum("status", ["draft", "generating", "ready", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoProject = typeof videoProjects.$inferSelect;
export type InsertVideoProject = typeof videoProjects.$inferInsert;

export const voices = mysqlTable("voices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  elevenLabsVoiceId: varchar("elevenLabsVoiceId", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  previewUrl: text("previewUrl"),
  
  gender: mysqlEnum("gender", ["male", "female", "neutral"]),
  age: mysqlEnum("age", ["young", "middle", "old"]),
  accent: varchar("accent", { length: 100 }),
  useCase: text("useCase"),
  
  usageCount: int("usageCount").default(0).notNull(),
  isFavorite: int("isFavorite").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Voice = typeof voices.$inferSelect;
export type InsertVoice = typeof voices.$inferInsert;
