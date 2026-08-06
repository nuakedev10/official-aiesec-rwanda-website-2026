import { pgTable, uuid, varchar, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';
import { donationFrequencyEnum, donationStatusEnum } from './enums';

// "Support Our Mission" tab on the Contact page.
export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  frequency: donationFrequencyEnum('frequency').notNull().default('one-time'),
  dedicateGift: boolean('dedicate_gift').notNull().default(false),
  dedicationNote: text('dedication_note'),
  status: donationStatusEnum('status').notNull().default('pending'),
  paymentReference: varchar('payment_reference', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
