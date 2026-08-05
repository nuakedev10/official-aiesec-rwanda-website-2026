import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { programTypeEnum, faqCategoryEnum } from './enums';

// "Choose Your Path" on the For Youth page — Incoming/Outgoing Global Volunteer.
export const programs = pgTable('programs', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  type: programTypeEnum('type').notNull(),
  description: text('description').notNull(),
  features: text('features').array().notNull().default([]),
  ctaLabel: varchar('cta_label', { length: 100 }).notNull().default('Learn More'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FAQ accordion.
export const faqs = pgTable('faqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: faqCategoryEnum('category').notNull().default('general'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type FAQ = typeof faqs.$inferSelect;
export type NewFAQ = typeof faqs.$inferInsert;
