import express from 'express';
import {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from '../controllers/product.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.patch('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);
router.post('/upload-images', verifyToken, requireAdmin, upload.array('images', 10), uploadProductImages);

export default router;
