import express from 'express';
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
  retryPayment,
} from '../controllers/order.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/retry-payment', retryPayment);

export default router;
