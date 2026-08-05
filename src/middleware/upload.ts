import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError';

// Handles image uploads (committee photos, story cover images) and PDF
// uploads (impact reports). Files land in /uploads; swap the storage engine
// for S3/Cloudinary later without touching any controller code.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

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
