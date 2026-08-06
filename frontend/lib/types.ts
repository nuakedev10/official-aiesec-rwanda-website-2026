export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
}

export interface SiteStat {
  id: string;
  key: string;
  label: string;
  value: string;
  page: 'home' | 'about' | 'stories';
}

export interface HomeData {
  stats: SiteStat[];
  testimonials: Testimonial[];
}

export interface CommitteeMember {
  id: string;
  fullName: string;
  position: string;
  committeeLevel: 'MC' | 'LC';
  localCommittee: string | null;
  photoUrl: string | null;
}

export interface LocalCommittee {
  id: string;
  name: string;
  region: string;
  description: string | null;
  iconKey: string | null;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface AboutData {
  committeeMembers: CommitteeMember[];
  localCommittees: LocalCommittee[];
  history: HistoryMilestone[];
  stats: SiteStat[];
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  type: 'incoming' | 'outgoing';
  description: string;
  features: string[];
  ctaLabel: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'youth' | 'partners' | 'alumni' | 'general';
}

export interface PartnershipOpportunity {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export interface PartnerSuccessStory {
  id: string;
  companyName: string;
  quote: string;
  metricValue: string;
  metricLabel: string;
}

export interface Alumni {
  id: string;
  fullName: string;
  classYear: number;
  jobTitle: string;
  company: string;
  location: string;
  industry: string;
  roleLevel: 'entry' | 'mid' | 'senior' | 'executive';
  bio: string;
  photoUrl: string | null;
}

export interface AlumniListResponse {
  data: Alumni[];
  total: number;
  page: number;
  limit: number;
}

export interface AlumniSuccessStory {
  id: string;
  title: string;
  excerpt: string;
  alumniName: string | null;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  category: 'Exchange Diary' | 'Leadership Story';
  excerpt: string;
  content: string;
  authorName: string;
  authorPhotoUrl: string | null;
  coverImageUrl: string | null;
  publishedAt: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  publishedAt: string;
}
