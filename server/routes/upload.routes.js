import express from 'express';
import { uploadImage, uploadVideo, deleteMedia } from '../controllers/upload.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Allow admin to upload images (up to 30 files at once)
router.post('/image', verifyToken, requireAdmin, upload.array('images', 30), uploadImage);

// Allow admin to upload single image via 'image' field
router.post('/single-image', verifyToken, requireAdmin, upload.single('image'), uploadImage);

// Allow admin to upload videos (up to 30 files at once)
router.post('/video', verifyToken, requireAdmin, upload.array('videos', 30), uploadVideo);

// Allow admin to delete media
router.delete('/media', verifyToken, requireAdmin, deleteMedia);

export default router;
