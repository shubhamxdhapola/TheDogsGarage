import express from 'express';
import { Setting } from '../models/Setting.js';

const router = express.Router();

// GET /api/settings - Public store configuration
router.get('/', async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: 'store_config' });
    if (!setting) {
      setting = await Setting.create({ key: 'store_config' });
    }
    return res.status(200).json({ success: true, settings: setting });
  } catch (error) {
    next(error);
  }
});

export default router;
