import { pgTable, uuid, varchar, text, timestamp, date } from 'drizzle-orm/pg-core';
import { applicationTypeEnum, applicationStatusEnum } from './enums';

// The "Apply Now" tab on the Contact page — toggles between Exchange
// Program and Membership Program, same fields either way.
export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationType: applicationTypeEnum('application_type').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  countryOfOrigin: varchar('country_of_origin', { length: 255 }).notNull(),
  programOfInterest: varchar('program_of_interest', { length: 255 }).notNull(),
  preferredStartDate: date('preferred_start_date').notNull(),
  motivation: text('motivation').notNull(),
  status: applicationStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
