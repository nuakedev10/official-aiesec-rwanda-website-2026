import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError';

// Used for committee photos, story cover images, and impact report PDFs.
//
// This is memoryStorage, not diskStorage. Vercel's serverless functions
// have an ephemeral, ready-only-outside-/tmp filesystem — anything written
// to disk here would vanish (or never persist across instances) the moment
// the function goes cold. Files stay in memory as a Buffer just long enough
// to hand off to Vercel Blob in uploadController.ts, then get discarded.
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only jpg, png, webp, and pdf files are allowed') as any);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});
