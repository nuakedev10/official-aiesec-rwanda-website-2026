import { Router } from 'express';
import {
  getAlumni,
  getAlumniProfile,
  connectWithAlumni,
  followAlumni,
  registerAlumni,
  getAlumniRegistrations,
} from '../controllers/alumniController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { alumniRegistrationSchema } from '../validators/schemas';

const router = Router();

router.get('/', getAlumni);
router.get('/:id', getAlumniProfile);
router.post('/:id/connect', protect, connectWithAlumni);
router.post('/:id/follow', protect, followAlumni);
router.post('/register', validate(alumniRegistrationSchema), registerAlumni);
router.get(
  '/admin/registrations',
  protect,
  restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'),
  getAlumniRegistrations
);

export default router;
