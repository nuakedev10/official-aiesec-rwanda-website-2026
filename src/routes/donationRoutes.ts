import { Router } from 'express';
import { createDonation, confirmDonation, getDonations } from '../controllers/donationController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { donationSchema } from '../validators/schemas';

const router = Router();

router.post('/', validate(donationSchema), createDonation);
router.patch('/:id/confirm', confirmDonation); // called by payment gateway webhook — see README
router.get('/admin', protect, restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'), getDonations);

export default router;
