import dotenv from 'dotenv';
dotenv.config();

import { sql } from 'drizzle-orm';
import { getDb, closeDb } from '../db';
import { hashPassword } from '../utils/password';
import {
  users,
  committeeMembers,
  localCommittees,
  historyMilestones,
  siteStats,
  testimonials,
  programs,
  faqs,
  partnershipOpportunities,
  partnerSuccessStories,
  alumni,
  alumniSuccessStories,
  stories,
  impactReports,
} from '../db/schema';

// Populates the database with content pulled straight from the Figma
// screens, so the frontend has real data to render against from day one
// instead of staring at empty states. Run with: npm run seed
// Safe to re-run — it truncates these tables each time.

const run = async () => {
  const db = getDb();
  console.log('Seeding...');

  // TRUNCATE ... CASCADE clears alumni_connections/alumni_followers too,
  // since they have foreign keys back to alumni and users.
  await db.execute(sql`
    TRUNCATE TABLE
      users, committee_members, local_committees, history_milestones,
      site_stats, testimonials, programs, faqs, partnership_opportunities,
      partner_success_stories, applications, partner_leads, donations,
      alumni, alumni_connections, alumni_followers, alumni_registrations,
      alumni_success_stories, stories, impact_reports
    CASCADE
  `);

  await db.insert(users).values({
    fullName: 'Super Admin',
    email: 'admin@aiesec.rw',
    password: await hashPassword('ChangeThisPassword123'),
    role: 'SUPER_ADMIN',
  });

  await db.insert(committeeMembers).values([
    { fullName: 'Miracle Ihejimba', position: 'MCP', committeeLevel: 'MC', order: 1 },
    { fullName: 'Collins Amabuo', position: 'MCVP MKT/PR/IM', committeeLevel: 'MC', order: 2 },
    { fullName: 'Vicky Mugo', position: 'MCVP MX/OD', committeeLevel: 'MC', order: 3 },
    { fullName: 'Adeyemi Mustapha', position: 'MCVP Finance/DPO', committeeLevel: 'MC', order: 4 },
    { fullName: 'Elyse Kwitonda', position: 'MCVP ICX', committeeLevel: 'MC', order: 5 },
    { fullName: 'Miracle Ihejimba', position: 'MCVP OGX/Expansion', committeeLevel: 'MC', order: 6 },
    { fullName: 'Henri Shema', position: 'MCVP BD/EWA', committeeLevel: 'MC', order: 7 },
  ]);

  await db.insert(localCommittees).values([
    { name: 'AIESEC Kigali', region: 'Main hub in the capital city', iconKey: 'building', order: 1 },
    { name: 'AIESEC HUYE', region: 'Southern region committee', iconKey: 'mountain', order: 2 },
    { name: 'AIESEC Musanze', region: 'Northern region committee', iconKey: 'leaf', order: 3 },
  ]);

  await db.insert(historyMilestones).values([
    { year: '2007', title: 'Foundation', description: 'AIESEC Rwanda was established with the first Local Committee in Kigali, marking the beginning of youth leadership development in post-genocide Rwanda.', order: 1 },
    { year: '2012', title: 'Expansion', description: 'Expanded to include AIESEC HUYE, bringing leadership opportunities to students at the University of Rwanda.', order: 2 },
    { year: '2016', title: 'Digital Transformation', description: 'Launched digital platforms and online exchange programs, connecting Rwandan youth with global opportunities in the digital age.', order: 3 },
    { year: '2020 - Present', title: 'Present day', description: 'Continued growth with AIESEC Musanze, now serving 100+ young leaders annually and contributing to Rwanda\u2019s Vision 2050.', order: 4 },
  ]);

  await db.insert(siteStats).values([
    { key: 'youth_developed', label: 'Youth Developed', value: '500+', page: 'home', order: 1 },
    { key: 'international_exchanges', label: 'International Exchanges', value: '150+', page: 'home', order: 2 },
    { key: 'partner_organizations', label: 'Partner Organizations', value: '80+', page: 'home', order: 3 },
    { key: 'universities_reached', label: 'Universities Reached', value: '25+', page: 'home', order: 4 },
    { key: 'countries', label: 'Countries', value: '120+', page: 'about', order: 1 },
    { key: 'active_members', label: 'Active Members', value: '40,000+', page: 'about', order: 2 },
    { key: 'universities', label: 'Universities', value: '2,600+', page: 'about', order: 3 },
    { key: 'years_of_impact', label: 'Years of Impact', value: '75+', page: 'about', order: 4 },
    { key: 'students_exchanged', label: 'Students Exchanged', value: '15,000+', page: 'stories', order: 1 },
    { key: 'career_growth', label: 'Career Growth', value: '85%', page: 'stories', order: 2 },
    { key: 'partner_countries', label: 'Partner Countries', value: '120', page: 'stories', order: 3 },
    { key: 'satisfaction_rate', label: 'Satisfaction Rate', value: '95%', page: 'stories', order: 4 },
  ]);

  await db.insert(testimonials).values([
    { name: 'Umurerwa Aline Carine', role: 'University of Rwanda Student', quote: 'AIESEC gave me the confidence to lead. I developed skills that helped me secure my dream internship at a tech startup.', rating: 5, order: 1 },
    { name: 'Jean', role: 'Bank of Kigali HR Director', quote: 'Partnering with AIESEC has given us access to exceptional young talent. Their graduates consistently demonstrate strong leadership and global mindset.', rating: 5, order: 2 },
    { name: 'Momoka', role: 'AIESEC Alumni, CEO Startup', quote: 'My AIESEC journey shaped who I am today. The network I built continues to open doors and create opportunities for collaboration across Africa.', rating: 5, order: 3 },
  ]);

  await db.insert(programs).values([
    {
      slug: 'incoming-global-volunteer', title: 'Incoming Global Volunteer', type: 'incoming',
      description: 'Host international volunteers in Rwanda and contribute to sustainable development projects while building cross-cultural friendships.',
      features: ['6-8 week exchange programs', 'Education & community development focus', 'Cultural immersion experience'],
      ctaLabel: 'Learn More', order: 1,
    },
    {
      slug: 'outgoing-global-volunteer', title: 'Outgoing Global Volunteer', type: 'outgoing',
      description: 'Travel abroad to make a global impact while developing leadership skills and gaining international work experience.',
      features: ['100+ countries available', 'Professional development opportunities', 'Global network building'],
      ctaLabel: 'Explore Opportunities', order: 2,
    },
  ]);

  await db.insert(faqs).values([
    { question: 'What is the age requirement to join AIESEC?', answer: 'To join AIESEC as a member or participant in global exchange programs, you generally must be between 18 and 30 years old.', category: 'youth', order: 1 },
    { question: 'How long do exchange programs typically last?', answer: 'Exchange programs typically last between 6 to 12 weeks, though some programs can extend up to 6 months depending on the opportunity and destination.', category: 'youth', order: 2 },
    { question: 'What support do I receive during my exchange?', answer: 'AIESEC provides comprehensive support including pre-departure preparation, airport pickup, accommodation assistance, cultural integration activities, and a local buddy system throughout your exchange.', category: 'youth', order: 3 },
    { question: 'Can I choose my destination country?', answer: 'Yes! You can browse and apply to opportunities in over 120 countries and territories worldwide. You select your preferred destination based on available projects that match your interests.', category: 'youth', order: 4 },
  ]);

  await db.insert(partnershipOpportunities).values([
    { title: 'Technology Partners', description: 'Integrate your solutions with our platform and reach millions of users worldwide.', features: ['API integration support', 'Co-marketing opportunities', 'Technical documentation'], ctaLabel: 'Apply Now', order: 1 },
    { title: 'Reseller Partners', description: 'Sell our solutions to your customers and earn attractive commissions.', features: ['Competitive pricing tiers', 'Sales training programs', 'Marketing materials'], ctaLabel: 'Apply Now', order: 2 },
  ]);

  await db.insert(partnerSuccessStories).values([
    { companyName: 'TechFlow Solutions', quote: 'Partnering with PartnerHub increased our revenue by 300% in just 18 months. Their support and resources are unmatched.', metricValue: '300%', metricLabel: 'Revenue Growth', order: 1 },
    { companyName: 'Digital Dynamics', quote: 'The integration was seamless and our clients love the new capabilities. We\u2019ve expanded to 15 new markets.', metricValue: '15', metricLabel: 'New Markets', order: 2 },
    { companyName: 'Enterprise Pro', quote: 'Our customer satisfaction scores improved dramatically after implementing their solutions in our workflow.', metricValue: '95%', metricLabel: 'Satisfaction Rate', order: 3 },
  ]);

  await db.insert(alumni).values([
    { fullName: 'Sarah Johnson', classYear: 2018, jobTitle: 'Senior Product Manager', company: 'Google', location: 'San Francisco, CA', industry: 'Technology', roleLevel: 'senior', bio: 'Passionate about building products that impact millions of users. Open to mentoring recent grads.' },
    { fullName: 'Michael Chen', classYear: 2015, jobTitle: 'Co-Founder & CTO', company: 'TechStart', location: 'New York, NY', industry: 'Technology', roleLevel: 'executive', bio: 'Serial entrepreneur with 3 successful exits. Currently building AI-powered solutions for healthcare.' },
    { fullName: 'Emily Rodriguez', classYear: 2012, jobTitle: 'Investment Director', company: 'Goldman Sachs', location: 'London, UK', industry: 'Finance', roleLevel: 'senior', bio: 'Specializing in emerging markets and sustainable investing. Active mentor in the alumni mentorship program.' },
  ]);

  await db.insert(alumniSuccessStories).values([
    { title: 'From Student to CEO', excerpt: 'Read how Alex Thompson built a billion-dollar startup', alumniName: 'Alex Thompson', order: 1 },
    { title: 'Making a Difference', excerpt: 'Dr. Maria\u2019s journey in global health initiatives', alumniName: 'Dr. Maria', order: 2 },
  ]);

  await db.insert(stories).values([
    { title: 'Finding My Voice: A Student\u2019s Journey in Rural HUYE', slug: 'finding-my-voice-rural-huye', category: 'Exchange Diary', excerpt: 'momoka\u2019s transformative experience teaching in rural at Huye opened her eyes to the power of education and community.', content: 'Full story content goes here.', authorName: 'momoka', publishedAt: new Date('2024-12-15') },
    { title: 'Building Bridges: From Corporate to Community', slug: 'building-bridges-corporate-community', category: 'Leadership Story', excerpt: 'How Marcus transformed his leadership approach after participating in our global exchange program.', content: 'Full story content goes here.', authorName: 'Marcus Johnson', publishedAt: new Date('2024-12-12') },
    { title: 'Cultural Fusion: Learning Beyond Borders', slug: 'cultural-fusion-learning-beyond-borders', category: 'Exchange Diary', excerpt: 'Ana\u2019s experience studying in Southeast Asia challenged her perspectives and created lasting friendships.', content: 'Full story content goes here.', authorName: 'Ana Rodriguez', publishedAt: new Date('2024-12-10') },
  ]);

  await db.insert(impactReports).values([
    { title: 'Annual Impact Report 2024', description: 'Comprehensive analysis of our global programs and their transformative effects on participants and communities.', fileUrl: '/uploads/annual-impact-report-2024.pdf', publishedAt: new Date('2024-12-01'), order: 1 },
    { title: 'Quarterly Update Q4 2024', description: 'Latest statistics and program updates from the final quarter of 2024.', fileUrl: '/uploads/quarterly-update-q4-2024.pdf', publishedAt: new Date('2024-12-20'), order: 2 },
  ]);

  console.log('Seed complete.');
  console.log('Admin login -> email: admin@aiesec.rw, password: ChangeThisPassword123 (change this immediately)');
  await closeDb();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
