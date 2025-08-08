import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address"),
  tonBalance: decimal("ton_balance", { precision: 18, scale: 8 }).default("0"),
  powerScore: integer("power_score").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rarity: text("rarity").notNull(), // Common, Rare, Epic, Legendary
  faction: text("faction"), // Shadow Realm, Moonlight Court, Ethereal Spirits
  power: integer("power").default(0),
  mana: integer("mana").default(0),
  abilities: jsonb("abilities").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decks = pgTable("decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id),
  name: text("name").notNull(),
  cardIds: jsonb("card_ids").$type<string[]>().default([]),
  avgMana: decimal("avg_mana", { precision: 3, scale: 1 }).default("0"),
  totalPower: integer("total_power").default(0),
  synergy: decimal("synergy", { precision: 3, scale: 1 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  type: text("type").notNull(), // Tournament, Challenge, Gathering
  status: text("status").notNull(), // Active, Upcoming, Ended
  prizePool: decimal("prize_pool", { precision: 18, scale: 8 }).default("0"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  requirements: jsonb("requirements").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // Purchase, Sale, Enhancement, Reward
  amount: decimal("amount", { precision: 18, scale: 8 }),
  description: text("description"),
  nftId: varchar("nft_id").references(() => nfts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  rank: integer("rank").notNull(),
  powerScore: integer("power_score").default(0),
  wins: integer("wins").default(0),
  title: text("title"),
  period: text("period").notNull(), // Weekly, Monthly, AllTime
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletAddress: true,
});

export const insertNftSchema = createInsertSchema(nfts).pick({
  ownerId: true,
  name: true,
  description: true,
  imageUrl: true,
  rarity: true,
  faction: true,
  power: true,
  mana: true,
  abilities: true,
  metadata: true,
});

export const insertDeckSchema = createInsertSchema(decks).pick({
  ownerId: true,
  name: true,
  cardIds: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  name: true,
  description: true,
  imageUrl: true,
  type: true,
  status: true,
  prizePool: true,
  maxParticipants: true,
  startDate: true,
  endDate: true,
  requirements: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
  nftId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type Deck = typeof decks.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
