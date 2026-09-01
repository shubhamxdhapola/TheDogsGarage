import express from 'express';
import {
  getCart,
  syncCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/sync', syncCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItemQuantity);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);

export default router;
