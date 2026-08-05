import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';

// POST /api/admin/upload — used for committee photos, story cover images,
// and impact report PDFs. Returns a URL the admin then pastes into the
// relevant create/update request (photoUrl, coverImageUrl, fileUrl).
export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { fileUrl } });
});
