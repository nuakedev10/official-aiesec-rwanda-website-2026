import { z } from 'zod';

export const applicationSchema = z.object({
  applicationType: z.enum(['exchange', 'membership']),
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  countryOfOrigin: z.string().min(2, 'Enter your country of origin'),
  programOfInterest: z.string().min(1, 'Choose a program'),
  preferredStartDate: z.string().min(1, 'Choose a preferred start date'),
  motivation: z.string().min(20, 'Tell us a bit more (at least 20 characters)'),
});

export const partnerLeadSchema = z.object({
  organizationName: z.string().min(2, 'Enter your organization name'),
  contactPerson: z.string().min(2, 'Enter a contact name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  partnershipType: z.string().min(1, 'Choose a partnership type'),
  message: z.string().min(10, 'Tell us a bit more about your organization'),
});

export const donationSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  amount: z.coerce.number().positive('Enter an amount greater than zero'),
  frequency: z.enum(['one-time', 'monthly']),
  dedicateGift: z.boolean().optional(),
  dedicationNote: z.string().optional().or(z.literal('')),
});

export const alumniRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  graduationYear: z.coerce
    .number()
    .int()
    .min(1990, 'Enter a valid year')
    .max(new Date().getFullYear(), 'Enter a valid year'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(2, 'Enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
export type PartnerLeadFormValues = z.infer<typeof partnerLeadSchema>;
export type DonationFormValues = z.infer<typeof donationSchema>;
export type AlumniRegistrationFormValues = z.infer<typeof alumniRegistrationSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;

export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
