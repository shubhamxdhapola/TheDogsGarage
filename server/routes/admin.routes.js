import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/admin.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAllCustomers);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
