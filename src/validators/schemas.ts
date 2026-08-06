import { z } from 'zod';

// One schema per form on the site. Keeping them in one file makes it easy
// to see exactly what every public-facing form actually requires.

export const applicationSchema = z.object({
  applicationType: z.enum(['exchange', 'membership']),
  fullName: z.string().min(2, 'Full name is too short'),
  email: z.string().email('Enter a valid email address'),
  countryOfOrigin: z.string().min(2),
  programOfInterest: z.string().min(2),
  preferredStartDate: z.coerce.date(),
  motivation: z.string().min(10, 'Tell us a bit more about why you want to join'),
});

export const partnerLeadSchema = z.object({
  organizationName: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  partnershipType: z.string().min(2),
  message: z.string().min(10),
  source: z.enum(['for_partners_page', 'contact_page']),
});

export const donationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  amount: z.number().positive('Donation amount must be greater than 0'),
  currency: z.string().default('USD'),
  frequency: z.enum(['one-time', 'monthly']),
  dedicateGift: z.boolean().default(false),
  dedicationNote: z.string().optional(),
});

export const alumniRegistrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  graduationYear: z.coerce.number().min(1990).max(new Date().getFullYear()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['MCP', 'MCVP', 'LC_ADMIN', 'SUPER_ADMIN']).optional(),
  committee: z.string().optional(),
  position: z.string().optional(),
});
