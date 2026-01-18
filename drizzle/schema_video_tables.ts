// Temporary file to test video tables syntax
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./schema";
import { offers } from "./schema";

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
