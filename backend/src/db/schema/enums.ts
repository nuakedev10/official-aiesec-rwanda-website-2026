import { pgEnum } from 'drizzle-orm/pg-core';

// Every enum used across the schema, kept in one place so a status value
// only has one source of truth instead of drifting between tables.
export const userRoleEnum = pgEnum('user_role', ['MCP', 'MCVP', 'LC_ADMIN', 'SUPER_ADMIN']);
export const committeeLevelEnum = pgEnum('committee_level', ['MC', 'LC']);
export const statPageEnum = pgEnum('stat_page', ['home', 'about', 'stories']);
export const programTypeEnum = pgEnum('program_type', ['incoming', 'outgoing']);
export const faqCategoryEnum = pgEnum('faq_category', ['youth', 'partners', 'alumni', 'general']);
export const applicationTypeEnum = pgEnum('application_type', ['exchange', 'membership']);
export const applicationStatusEnum = pgEnum('application_status', [
  'new',
  'reviewing',
  'accepted',
  'rejected',
]);
export const partnerLeadSourceEnum = pgEnum('partner_lead_source', [
  'for_partners_page',
  'contact_page',
]);
export const partnerLeadStatusEnum = pgEnum('partner_lead_status', [
  'new',
  'contacted',
  'in_discussion',
  'closed',
]);
export const donationFrequencyEnum = pgEnum('donation_frequency', ['one-time', 'monthly']);
export const donationStatusEnum = pgEnum('donation_status', ['pending', 'completed', 'failed']);
export const roleLevelEnum = pgEnum('role_level', ['entry', 'mid', 'senior', 'executive']);
export const alumniRegistrationStatusEnum = pgEnum('alumni_registration_status', [
  'pending',
  'approved',
  'rejected',
]);
export const storyCategoryEnum = pgEnum('story_category', ['Exchange Diary', 'Leadership Story']);
