import express from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  uploadPetImages,
  deletePetImage,
  uploadPetVideos,
  deletePetVideo,
} from '../controllers/pet.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Admin-only CRUD
router.post('/', verifyToken, requireAdmin, createPet);
router.put('/:id', verifyToken, requireAdmin, updatePet);
router.patch('/:id', verifyToken, requireAdmin, updatePet);
router.delete('/:id', verifyToken, requireAdmin, deletePet);

// Admin media routes (strictly max 30 photos / 30 videos FIFO limit)
router.post('/:id/images', verifyToken, requireAdmin, upload.array('images', 30), uploadPetImages);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, deletePetImage);

router.post('/:id/videos', verifyToken, requireAdmin, upload.array('videos', 30), uploadPetVideos);
router.delete('/:id/videos/:videoId', verifyToken, requireAdmin, deletePetVideo);

export default router;
