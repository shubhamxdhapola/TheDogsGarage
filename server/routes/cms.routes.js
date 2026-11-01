import express from 'express';
import { getCmsContent, updateCmsContent, resetCmsContent } from '../controllers/cms.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/cms - Public
router.get('/', getCmsContent);

// PUT /api/cms - Admin only
router.put('/', verifyToken, requireAdmin, updateCmsContent);

// POST /api/cms/reset - Admin only
router.post('/reset', verifyToken, requireAdmin, resetCmsContent);

export default router;

