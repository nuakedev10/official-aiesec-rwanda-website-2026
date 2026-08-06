import { Router } from 'express';
import { submitPartnerLead, getPartnerLeads, updatePartnerLeadStatus } from '../controllers/partnerLeadController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { partnerLeadSchema } from '../validators/schemas';

const router = Router();

router.post('/', validate(partnerLeadSchema), submitPartnerLead);
router.get('/admin', protect, restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'), getPartnerLeads);
router.patch('/admin/:id/status', protect, restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'), updatePartnerLeadStatus);

export default router;
