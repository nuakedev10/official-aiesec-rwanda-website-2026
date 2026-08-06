import { Router } from 'express';
import { getAboutPage } from '../controllers/aboutController';

const router = Router();
router.get('/', getAboutPage);
export default router;
