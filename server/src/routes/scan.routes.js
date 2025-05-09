import express from 'express';
import {
  getScansForWebsite,
  getScan,
  getScanRecommendations,
  getLatestScan,
} from '../controllers/scan.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Scan routes
router.get('/website/:websiteId', getScansForWebsite);
router.get('/website/:websiteId/latest', getLatestScan);
router.get('/:id', getScan);
router.get('/:id/recommendations', getScanRecommendations);

export default router;
