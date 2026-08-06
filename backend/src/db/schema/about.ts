import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { committeeLevelEnum, statPageEnum } from './enums';

// Member Committee grid — "Collins Amabuo - MCVP MKT/PR/IM" etc.
export const committeeMembers = pgTable('committee_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  committeeLevel: committeeLevelEnum('committee_level').notNull().default('MC'),
  localCommittee: varchar('local_committee', { length: 255 }),
  photoUrl: text('photo_url'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// "AIESEC Kigali", "AIESEC HUYE", "AIESEC Musanze" cards.
export const localCommittees = pgTable('local_committees', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  region: varchar('region', { length: 255 }).notNull(),
  description: text('description'),
  iconKey: varchar('icon_key', { length: 100 }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// "History of AIESEC in Rwanda" timeline: 2007 Foundation -> 2020-Present.
export const historyMilestones = pgTable('history_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Powers every stat block on the site — 500+ Youth Developed,
// 120+ Countries, 40,000+ Active Members, etc. Keyed so admins can update
// numbers without a redeploy.
export const siteStats = pgTable('site_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  label: varchar('label', { length: 255 }).notNull(),
  value: varchar('value', { length: 50 }).notNull(),
  page: statPageEnum('page').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type CommitteeMember = typeof committeeMembers.$inferSelect;
export type NewCommitteeMember = typeof committeeMembers.$inferInsert;
export type LocalCommittee = typeof localCommittees.$inferSelect;
export type NewLocalCommittee = typeof localCommittees.$inferInsert;
export type HistoryMilestone = typeof historyMilestones.$inferSelect;
export type NewHistoryMilestone = typeof historyMilestones.$inferInsert;
export type SiteStat = typeof siteStats.$inferSelect;
export type NewSiteStat = typeof siteStats.$inferInsert;
