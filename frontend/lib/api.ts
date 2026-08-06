import type {
  AboutData,
  Alumni,
  AlumniListResponse,
  AlumniSuccessStory,
  FAQ,
  HomeData,
  ImpactReport,
  PartnerSuccessStory,
  PartnershipOpportunity,
  Program,
  Story,
} from './types';
import {
  fallbackAbout,
  fallbackAlumni,
  fallbackAlumniStories,
  fallbackFaqs,
  fallbackHome,
  fallbackImpactReports,
  fallbackImpactStats,
  fallbackPartnerOpportunities,
  fallbackPartnerStories,
  fallbackPrograms,
  fallbackStories,
} from './fallback';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
  }
}

async function apiGet<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new ApiError(`GET ${path} failed with ${res.status}`, res.status);
  }
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data?.message || `POST ${path} failed with ${res.status}`, res.status, data);
  }
  return data;
}

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

// -- Reads (server components; fall back to placeholder content if the
// backend isn't reachable yet, e.g. in local frontend-only development) --

export const getHome = () => withFallback(() => apiGet<HomeData>('/home'), fallbackHome);

export const getAbout = () => withFallback(() => apiGet<AboutData>('/about'), fallbackAbout);

export const getPrograms = () =>
  withFallback(() => apiGet<Program[]>('/programs'), fallbackPrograms);

export const getFaqs = () => withFallback(() => apiGet<FAQ[]>('/faqs'), fallbackFaqs);

export const getPartnershipOpportunities = () =>
  withFallback(
    () => apiGet<PartnershipOpportunity[]>('/partnership-opportunities'),
    fallbackPartnerOpportunities
  );

export const getPartnerSuccessStories = () =>
  withFallback(
    () => apiGet<PartnerSuccessStory[]>('/partner-success-stories'),
    fallbackPartnerStories
  );

export interface AlumniFilters {
  generation?: string;
  industry?: string;
  location?: string;
  roleLevel?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export const getAlumni = (filters: AlumniFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return withFallback(
    () => apiGet<AlumniListResponse>(`/alumni${qs ? `?${qs}` : ''}`, 60),
    fallbackAlumni
  );
};

export const getAlumniSuccessStories = () =>
  withFallback(
    () => apiGet<AlumniSuccessStory[]>('/alumni-success-stories'),
    fallbackAlumniStories
  );

export interface StoryFilters {
  category?: string;
  q?: string;
}

export const getStories = (filters: StoryFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return withFallback(() => apiGet<Story[]>(`/stories${qs ? `?${qs}` : ''}`), fallbackStories);
};

export const getStoryBySlug = (slug: string) =>
  withFallback(
    () => apiGet<Story>(`/stories/${slug}`),
    fallbackStories.find((s) => s.slug === slug) ?? null
  );

export const getImpactReports = () =>
  withFallback(() => apiGet<ImpactReport[]>('/impact-reports'), fallbackImpactReports);

export const getImpactStats = () =>
  withFallback(() => apiGet<HomeData['stats']>('/stats?page=stories'), fallbackImpactStats);

export const getAlumniFilterOptions = (list: Alumni[]) => ({
  generations: Array.from(new Set(list.map((a) => a.classYear))).sort((a, b) => b - a),
  industries: Array.from(new Set(list.map((a) => a.industry))).sort(),
  locations: Array.from(new Set(list.map((a) => a.location))).sort(),
});

// -- Writes (client components submit these directly) --

export interface ApplicationInput {
  applicationType: 'exchange' | 'membership';
  fullName: string;
  email: string;
  countryOfOrigin: string;
  programOfInterest: string;
  preferredStartDate: string;
  motivation: string;
}

export const submitApplication = (input: ApplicationInput) =>
  apiPost('/applications', input);

export interface PartnerLeadInput {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message: string;
  source: 'for_partners_page' | 'contact_page';
}

export const submitPartnerLead = (input: PartnerLeadInput) =>
  apiPost('/partner-leads', input);

export interface DonationInput {
  fullName: string;
  email: string;
  amount: number;
  currency?: string;
  frequency?: 'one-time' | 'monthly';
  dedicateGift?: boolean;
  dedicationNote?: string;
}

export const submitDonation = (input: DonationInput) => apiPost('/donations', input);

export interface AlumniRegistrationInput {
  fullName: string;
  email: string;
  graduationYear: number;
}

export const submitAlumniRegistration = (input: AlumniRegistrationInput) =>
  apiPost('/alumni/register', input);

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// The design has no dedicated /contact backend route (Contact was a nav
// gap in the original Figma file — see README). The Contact page's general
// message form maps onto the same partner-lead intake shape used
// elsewhere, tagged distinctly, until a first-class /contact endpoint
// exists on the backend.
export const submitContactMessage = (input: ContactInput) =>
  apiPost('/partner-leads', {
    organizationName: 'General Contact',
    contactPerson: input.name,
    email: input.email,
    partnershipType: input.subject,
    message: input.message,
    source: 'contact_page',
  });
