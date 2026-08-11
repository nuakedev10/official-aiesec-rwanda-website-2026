// Placeholder content shown when the backend API (see ../../README.md) is
// unreachable or not yet seeded — e.g. during local frontend-only
// development. Every shape here mirrors the real API response exactly, so
// swapping in live data never requires touching a page component.
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
  SiteStat,
  Story,
} from './types';

export const fallbackHome: HomeData = {
  stats: [
    { id: '1', key: 'youth_developed', label: 'Youth Developed', value: '500+', page: 'home' },
    { id: '2', key: 'exchanges', label: 'International Exchanges', value: '350+', page: 'home' },
    { id: '3', key: 'partners', label: 'Partner Organizations', value: '80+', page: 'home' },
    { id: '4', key: 'universities', label: 'Universities Reached', value: '12', page: 'home' },
  ],
  testimonials: [
    {
      id: '1',
      name: 'Uwase Diane',
      role: 'Alumna, Global Volunteer — Ghana',
      quote:
        'AIESEC gave me my first leadership role and my first international exchange in the same year. I came back a different person.',
      rating: 5,
      photoUrl: null,
    },
    {
      id: '2',
      name: 'Jean Paul Habimana',
      role: 'Partner, Bank of Kigali',
      quote:
        'Working with AIESEC in Rwanda gave us access to some of the most driven young talent in the country.',
      rating: 5,
      photoUrl: null,
    },
    {
      id: '3',
      name: 'Grace Mukamana',
      role: 'Local Committee President, AIESEC Kigali',
      quote:
        'Every year I watch members walk in unsure of themselves and walk out ready to lead. That is the whole point.',
      rating: 5,
      photoUrl: null,
    },
  ],
};

export const fallbackAbout: AboutData = {
  committeeMembers: [
    { id: '1', fullName: 'Collins Amabuo', position: 'MCVP Marketing, PR & IM', committeeLevel: 'MC', localCommittee: null, photoUrl: null },
    { id: '2', fullName: 'Uwimana Aline', position: 'MCVP Talent Management', committeeLevel: 'MC', localCommittee: null, photoUrl: null },
    { id: '3', fullName: 'Niyonzima Eric', position: 'MCVP Business Development', committeeLevel: 'MC', localCommittee: null, photoUrl: null },
    { id: '4', fullName: 'Ingabire Sandrine', position: 'MCVP Outgoing Global Volunteer', committeeLevel: 'MC', localCommittee: null, photoUrl: null },
  ],
  localCommittees: [
    { id: '1', name: 'AIESEC Kigali', region: 'Kigali City', description: 'The founding local committee, running exchange and talent programs across the capital.', iconKey: 'blue' },
    { id: '2', name: 'AIESEC Huye', region: 'Southern Province', description: 'Home to the University of Rwanda main campus community and its exchange members.', iconKey: 'green' },
    { id: '3', name: 'AIESEC Musanze', region: 'Northern Province', description: 'A growing committee connecting Northern Province students to global opportunities.', iconKey: 'purple' },
  ],
  history: [
    { id: '1', year: '2007', title: 'Foundation', description: 'AIESEC in Rwanda is founded, becoming a full member of the AIESEC global network.' },
    { id: '2', year: '2012', title: 'National Expansion', description: 'The second local committee opens outside Kigali, reaching more universities.' },
    { id: '3', year: '2018', title: '1,000th Exchange', description: 'AIESEC in Rwanda facilitates its 1,000th international exchange participant.' },
    { id: '4', year: '2020-Present', title: 'Digital Growth', description: 'Programs expand into virtual exchange and remote internships, reaching more youth than ever.' },
  ],
  stats: [
    { id: '1', key: 'countries', label: 'Countries in Network', value: '120+', page: 'about' },
    { id: '2', key: 'members', label: 'Active Members', value: '40,000+', page: 'about' },
  ],
};

export const fallbackPrograms: Program[] = [
  {
    id: '1',
    slug: 'incoming-global-volunteer',
    title: 'Incoming Global Volunteer',
    type: 'incoming',
    description: 'Come to Rwanda and work on a social impact project with a local team for 6-8 weeks.',
    features: ['Social impact projects across Rwanda', 'Full local support & accommodation help', 'Cultural immersion program', 'Certificate of completion'],
    ctaLabel: 'Apply as Incoming Volunteer',
  },
  {
    id: '2',
    slug: 'outgoing-global-volunteer',
    title: 'Outgoing Global Volunteer',
    type: 'outgoing',
    description: 'Travel abroad to work on a social impact project in one of 120+ countries.',
    features: ['120+ destination countries', 'Pre-departure training', 'Global community of AIESECers', 'Leadership development track'],
    ctaLabel: 'Apply as Outgoing Volunteer',
  },
];

export const fallbackFaqs: FAQ[] = [
  { id: '1', question: 'Who can join AIESEC in Rwanda?', answer: 'Any student or recent graduate aged 18-30 can apply to become a member or exchange participant.', category: 'general' },
  { id: '2', question: 'How long do exchange programs last?', answer: 'Most Global Volunteer programs run 6-8 weeks; Global Talent and Global Teacher internships can run 3-12 months.', category: 'youth' },
  { id: '3', question: 'Is there a cost to participate?', answer: 'There is a program fee that covers matching, support, and administration; travel, visa, and living costs are separate.', category: 'youth' },
  { id: '4', question: 'Do I need work experience to apply?', answer: 'No prior experience is required for Global Volunteer — just motivation and openness to a new culture.', category: 'general' },
];

export const fallbackPartnerOpportunities: PartnershipOpportunity[] = [
  {
    id: '1',
    title: 'Technology Partners',
    description: 'Provide the tools and platforms AIESEC in Rwanda uses to run exchange and talent programs at scale.',
    features: ['Brand visibility across national events', 'Access to youth talent pipeline', 'Co-branded case studies'],
    ctaLabel: 'Apply Now',
  },
  {
    id: '2',
    title: 'Reseller / Talent Partners',
    description: 'Host Global Talent and Global Teacher interns, or resell exchange opportunities to your own network.',
    features: ['Vetted, pre-matched candidates', 'Onboarding & support included', 'Flexible internship lengths'],
    ctaLabel: 'Apply Now',
  },
];

export const fallbackPartnerStories: PartnerSuccessStory[] = [
  { id: '1', companyName: 'Bank of Kigali', quote: 'Hosted 12 international interns across two years.', metricValue: '40%', metricLabel: 'Faster onboarding of junior talent', logoUrl: '/images/partners/bank-of-kigali-logo.png' },
  { id: '2', companyName: 'Zipline Rwanda', quote: 'Built a pipeline of globally-minded engineering talent.', metricValue: '3x', metricLabel: 'Growth in youth applicant pool', logoUrl: '/images/partners/zipline-logo.png' },
  { id: '3', companyName: 'Rwanda Stock Exchange', quote: 'Partnered on financial literacy workshops for youth across Rwanda.', metricValue: '15+', metricLabel: 'Youth financial literacy sessions', logoUrl: '/images/partners/Rwanda_Stock_Exchange_logo.png' },
  { id: '4', companyName: 'University of Rwanda', quote: 'Co-created leadership development curricula for students.', metricValue: '500+', metricLabel: 'Students engaged annually', logoUrl: '/images/partners/university_of_rwanda_logo.jpg' },
];

export const fallbackAlumniStories: AlumniSuccessStory[] = [
  { id: '1', title: 'From Volunteer to Founder', excerpt: 'How a 2016 exchange to Kenya turned into a Kigali-based agtech startup.', alumniName: 'Eric N.' },
  { id: '2', title: 'From Student to CEO', excerpt: 'An AIESEC internship in Germany became a decade-long career in manufacturing leadership.', alumniName: 'Diane U.' },
];

export const fallbackAlumni: AlumniListResponse = {
  data: [
    { id: '1', fullName: 'Sarah Johnson', classYear: 2015, jobTitle: 'Product Manager', company: 'Google', location: 'Nairobi, Kenya', industry: 'Technology', roleLevel: 'senior', bio: 'Led three exchange cohorts before moving into international tech product roles.', photoUrl: null },
    { id: '2', fullName: 'Michael Chen', classYear: 2017, jobTitle: 'Investment Analyst', company: 'Standard Bank', location: 'Kigali, Rwanda', industry: 'Finance', roleLevel: 'mid', bio: 'Started as a Local Committee VP before joining the finance sector.', photoUrl: null },
    { id: '3', fullName: 'Emily Rodriguez', classYear: 2019, jobTitle: 'Program Officer', company: 'UNDP Rwanda', location: 'Kigali, Rwanda', industry: 'Development', roleLevel: 'entry', bio: 'Alumna of the Global Talent program, now working in youth development policy.', photoUrl: null },
  ],
  total: 3,
  page: 1,
  limit: 10,
};

export const fallbackStories: Story[] = [
  {
    id: '1',
    title: 'Six Weeks in Accra Changed How I See Leadership',
    slug: 'six-weeks-in-accra',
    category: 'Exchange Diary',
    excerpt: 'A first-hand account of an outgoing Global Volunteer exchange to Ghana and the leadership lessons that followed.',
    content: '',
    authorName: 'Uwase Diane',
    authorPhotoUrl: null,
    coverImageUrl: '/images/stories/story-1.jpg',
    publishedAt: new Date('2025-03-10').toISOString(),
  },
  {
    id: '2',
    title: 'Building a National Committee From Five People',
    slug: 'building-a-national-committee',
    category: 'Leadership Story',
    excerpt: 'How AIESEC Musanze grew from a five-member founding team into a fully-fledged local committee.',
    content: '',
    authorName: 'Niyonzima Eric',
    authorPhotoUrl: null,
    coverImageUrl: '/images/stories/story-2.jpg',
    publishedAt: new Date('2025-01-22').toISOString(),
  },
  {
    id: '3',
    title: 'What Hosting Ten International Volunteers Taught Our Team',
    slug: 'hosting-ten-international-volunteers',
    category: 'Leadership Story',
    excerpt: 'Reflections from a partner organization on hosting incoming Global Volunteers over two consecutive summers.',
    content: '',
    authorName: 'Grace Mukamana',
    authorPhotoUrl: null,
    coverImageUrl: '/images/stories/story-3.jpg',
    publishedAt: new Date('2024-11-05').toISOString(),
  },
];

export const fallbackImpactReports: ImpactReport[] = [
  { id: '1', title: 'Annual Impact Report 2025', description: 'Full-year results across all exchange, talent, and partnership programs.', fileUrl: '/documents/annual-impact-report-2025.pdf', publishedAt: new Date('2025-12-01').toISOString() },
  { id: '2', title: 'Q2 2026 Update', description: 'A quarterly snapshot of exchanges, new partnerships, and community growth.', fileUrl: '/documents/quarterly-update-q2-2026.pdf', publishedAt: new Date('2026-07-01').toISOString() },
];

export const fallbackImpactStats: SiteStat[] = [
  { id: '1', key: 'students_reached', label: 'Students Reached', value: '15,000+', page: 'stories' },
  { id: '2', key: 'career_growth', label: 'Career Growth Rate', value: '87%', page: 'stories' },
  { id: '3', key: 'partner_countries', label: 'Partner Countries', value: '45', page: 'stories' },
  { id: '4', key: 'satisfaction', label: 'Satisfaction Rate', value: '96%', page: 'stories' },
];
