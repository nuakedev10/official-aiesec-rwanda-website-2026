import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { partnerLeadSourceEnum, partnerLeadStatusEnum } from './enums';

// "Partnership Opportunities" — Technology Partners, Reseller Partners.
export const partnershipOpportunities = pgTable('partnership_opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  features: text('features').array().notNull().default([]),
  ctaLabel: varchar('cta_label', { length: 100 }).notNull().default('Apply Now'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// "Success Stories" on the For Partners page.
export const partnerSuccessStories = pgTable('partner_success_stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  quote: text('quote').notNull(),
  metricValue: varchar('metric_value', { length: 50 }).notNull(),
  metricLabel: varchar('metric_label', { length: 255 }).notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Covers BOTH the For Partners "Get in Touch" form and the Contact page's
// "Partner With Us" tab — same intent, `source` tells them apart.
export const partnerLeads = pgTable('partner_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationName: varchar('organization_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  partnershipType: varchar('partnership_type', { length: 255 }).notNull(),
  message: text('message').notNull(),
  source: partnerLeadSourceEnum('source').notNull(),
  status: partnerLeadStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PartnershipOpportunity = typeof partnershipOpportunities.$inferSelect;
export type NewPartnershipOpportunity = typeof partnershipOpportunities.$inferInsert;
export type PartnerSuccessStory = typeof partnerSuccessStories.$inferSelect;
export type NewPartnerSuccessStory = typeof partnerSuccessStories.$inferInsert;
export type PartnerLead = typeof partnerLeads.$inferSelect;
export type NewPartnerLead = typeof partnerLeads.$inferInsert;
