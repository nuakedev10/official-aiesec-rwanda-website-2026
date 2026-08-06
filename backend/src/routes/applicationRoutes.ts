import { Router } from 'express';
import { submitApplication, getApplications, updateApplicationStatus } from '../controllers/applicationController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { applicationSchema } from '../validators/schemas';

const router = Router();

router.post('/', validate(applicationSchema), submitApplication);
router.get('/admin', protect, restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'), getApplications);
router.patch('/admin/:id/status', protect, restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'), updateApplicationStatus);

export default router;
