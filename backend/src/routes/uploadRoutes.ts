import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';
import { protect, restrictTo } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN', 'MCP', 'MCVP'),
  upload.single('file'),
  uploadFile
);
export default router;
