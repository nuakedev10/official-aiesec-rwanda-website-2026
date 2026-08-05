import { buildCrudRoutes } from './routeFactory';
import {
  committeeMemberCtrl,
  localCommitteeCtrl,
  historyMilestoneCtrl,
  siteStatCtrl,
  testimonialCtrl,
  programCtrl,
  faqCtrl,
  partnershipOpportunityCtrl,
  partnerSuccessStoryCtrl,
  alumniSuccessStoryCtrl,
  impactReportCtrl,
} from '../controllers/contentControllers';

export const committeeMemberRoutes = buildCrudRoutes(committeeMemberCtrl);
export const localCommitteeRoutes = buildCrudRoutes(localCommitteeCtrl);
export const historyMilestoneRoutes = buildCrudRoutes(historyMilestoneCtrl);
export const siteStatRoutes = buildCrudRoutes(siteStatCtrl, ['SUPER_ADMIN']);
export const testimonialRoutes = buildCrudRoutes(testimonialCtrl);
export const programRoutes = buildCrudRoutes(programCtrl);
export const faqRoutes = buildCrudRoutes(faqCtrl);
export const partnershipOpportunityRoutes = buildCrudRoutes(partnershipOpportunityCtrl);
export const partnerSuccessStoryRoutes = buildCrudRoutes(partnerSuccessStoryCtrl);
export const alumniSuccessStoryRoutes = buildCrudRoutes(alumniSuccessStoryCtrl);
export const impactReportRoutes = buildCrudRoutes(impactReportCtrl);
