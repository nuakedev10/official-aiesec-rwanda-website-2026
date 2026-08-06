import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { storyCategoryEnum } from './enums';

// "Exchange Diaries & Leadership Stories" on the Stories page.
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  category: storyCategoryEnum('category').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorPhotoUrl: text('author_photo_url'),
  coverImageUrl: text('cover_image_url'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// "Impact Reports & Statistics" downloadable PDFs.
export const impactReports = pgTable('impact_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  fileUrl: text('file_url').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
export type ImpactReport = typeof impactReports.$inferSelect;
export type NewImpactReport = typeof impactReports.$inferInsert;
