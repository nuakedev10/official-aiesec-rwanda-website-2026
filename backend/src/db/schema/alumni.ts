import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { roleLevelEnum, alumniRegistrationStatusEnum } from './enums';
import { users } from './users';

// The Alumni Directory — Sarah Johnson, Michael Chen, Emily Rodriguez cards.
export const alumni = pgTable('alumni', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  classYear: integer('class_year').notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 255 }).notNull(),
  roleLevel: roleLevelEnum('role_level').notNull().default('mid'),
  bio: text('bio').notNull(),
  photoUrl: text('photo_url'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mongoose modeled Connect/Follow as arrays embedded on the Alumni
// document. Postgres doesn't have a natural equivalent, so each becomes
// its own join table — this is also just the more correct way to model a
// many-to-many relationship, since either side can now be queried
// directly (e.g. "which alumni has this user connected with") without
// scanning every alumni row.
export const alumniConnections = pgTable(
  'alumni_connections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    alumniId: uuid('alumni_id').notNull().references(() => alumni.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueConnection: unique().on(table.alumniId, table.userId),
  })
);

export const alumniFollowers = pgTable(
  'alumni_followers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    alumniId: uuid('alumni_id').notNull().references(() => alumni.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueFollow: unique().on(table.alumniId, table.userId),
  })
);

// "New Alumni Registration" sidebar form — a raw signup an admin reviews
// and promotes into a full Alumni profile. Kept separate from `alumni` on
// purpose: this is unverified input, not a published profile yet.
export const alumniRegistrations = pgTable('alumni_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  graduationYear: integer('graduation_year').notNull(),
  status: alumniRegistrationStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// "Featured Success Stories" sidebar on the Alumni page.
export const alumniSuccessStories = pgTable('alumni_success_stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  alumniName: varchar('alumni_name', { length: 255 }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Alumni = typeof alumni.$inferSelect;
export type NewAlumni = typeof alumni.$inferInsert;
export type AlumniRegistration = typeof alumniRegistrations.$inferSelect;
export type NewAlumniRegistration = typeof alumniRegistrations.$inferInsert;
export type AlumniSuccessStory = typeof alumniSuccessStories.$inferSelect;
export type NewAlumniSuccessStory = typeof alumniSuccessStories.$inferInsert;
