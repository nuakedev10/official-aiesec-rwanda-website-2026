import { Router } from 'express';

import authRoutes from './authRoutes';
import homeRoutes from './homeRoutes';
import aboutRoutes from './aboutRoutes';
import applicationRoutes from './applicationRoutes';
import partnerLeadRoutes from './partnerLeadRoutes';
import donationRoutes from './donationRoutes';
import alumniRoutes from './alumniRoutes';
import storyRoutes from './storyRoutes';
import uploadRoutes from './uploadRoutes';
import {
  committeeMemberRoutes,
  localCommitteeRoutes,
  historyMilestoneRoutes,
  siteStatRoutes,
  testimonialRoutes,
  programRoutes,
  faqRoutes,
  partnershipOpportunityRoutes,
  partnerSuccessStoryRoutes,
  alumniSuccessStoryRoutes,
  impactReportRoutes,
} from './contentRoutes';

const router = Router();

// Page aggregators — one call per page load
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);

// Auth
router.use('/auth', authRoutes);

// About-page content
router.use('/committee-members', committeeMemberRoutes);
router.use('/local-committees', localCommitteeRoutes);
router.use('/history', historyMilestoneRoutes);
router.use('/stats', siteStatRoutes);

// Home-page content
router.use('/testimonials', testimonialRoutes);

// For Youth page
router.use('/programs', programRoutes);
router.use('/faqs', faqRoutes);

// For Partners page
router.use('/partnership-opportunities', partnershipOpportunityRoutes);
router.use('/partner-success-stories', partnerSuccessStoryRoutes);
router.use('/partner-leads', partnerLeadRoutes);

// Contact / Get Involved page
router.use('/applications', applicationRoutes);
router.use('/donations', donationRoutes);

// Alumni page
router.use('/alumni', alumniRoutes);
router.use('/alumni-success-stories', alumniSuccessStoryRoutes);

// Stories page
router.use('/stories', storyRoutes);
router.use('/impact-reports', impactReportRoutes);

// File uploads (admin)
router.use('/admin/upload', uploadRoutes);

export default router;
