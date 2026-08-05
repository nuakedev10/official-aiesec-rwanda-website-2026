// Thin wiring file: one crudFactory() call per simple content table.
// This is what routes/*.ts import from — keeps each route file trivial.
import { crudFactory } from './crudFactory';
import {
  committeeMembers,
  localCommittees,
  historyMilestones,
  siteStats,
  testimonials,
  programs,
  faqs,
  partnershipOpportunities,
  partnerSuccessStories,
  alumniSuccessStories,
  impactReports,
} from '../db/schema';

export const committeeMemberCtrl = crudFactory(committeeMembers, committeeMembers.id, {
  orderColumn: committeeMembers.order,
});
export const localCommitteeCtrl = crudFactory(localCommittees, localCommittees.id, {
  orderColumn: localCommittees.order,
});
export const historyMilestoneCtrl = crudFactory(historyMilestones, historyMilestones.id, {
  orderColumn: historyMilestones.order,
});
export const siteStatCtrl = crudFactory(siteStats, siteStats.id, { orderColumn: siteStats.order });
export const testimonialCtrl = crudFactory(testimonials, testimonials.id, {
  orderColumn: testimonials.order,
});
export const programCtrl = crudFactory(programs, programs.id, { orderColumn: programs.order });
export const faqCtrl = crudFactory(faqs, faqs.id, { orderColumn: faqs.order });
export const partnershipOpportunityCtrl = crudFactory(
  partnershipOpportunities,
  partnershipOpportunities.id,
  { orderColumn: partnershipOpportunities.order }
);
export const partnerSuccessStoryCtrl = crudFactory(partnerSuccessStories, partnerSuccessStories.id, {
  orderColumn: partnerSuccessStories.order,
});
export const alumniSuccessStoryCtrl = crudFactory(alumniSuccessStories, alumniSuccessStories.id, {
  orderColumn: alumniSuccessStories.order,
});
export const impactReportCtrl = crudFactory(impactReports, impactReports.id, {
  orderColumn: impactReports.publishedAt,
  orderDirection: 'desc',
});
