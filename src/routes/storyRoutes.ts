import { Router } from 'express';
import { getStories, getStoryBySlug } from '../controllers/storyController';

const router = Router();
router.get('/', getStories);
router.get('/:slug', getStoryBySlug);
export default router;
