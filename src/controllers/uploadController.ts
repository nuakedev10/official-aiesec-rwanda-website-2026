import { Request, Response } from 'express';
import { put } from '@vercel/blob';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';

// POST /api/admin/upload — used for committee photos, story cover images,
// and impact report PDFs. Returns a public URL the admin then pastes into
// the relevant create/update request (photoUrl, coverImageUrl, fileUrl).
//
// Uploads go straight to Vercel Blob rather than local disk. On Vercel
// specifically this isn't optional — express.static() doesn't serve
// anything there (see the Express-on-Vercel docs), and the filesystem is
// ephemeral anyway. Off Vercel, this still works fine as long as
// BLOB_READ_WRITE_TOKEN is set; Vercel Blob is usable from any Node
// environment, not just Vercel-hosted ones.
export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new ApiError(
      500,
      'File uploads are not configured. Set BLOB_READ_WRITE_TOKEN (see README "File uploads").'
    );
  }

  const blob = await put(req.file.originalname, req.file.buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: req.file.mimetype,
  });

  res.status(201).json({ success: true, data: { fileUrl: blob.url } });
});
