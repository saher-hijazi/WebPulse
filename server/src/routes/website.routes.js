import express from 'express';
import {
  getWebsites,
  getWebsite,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  runScan,
  getPerformanceHistory,
} from '../controllers/website.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Website routes
router.route('/')
  .get(getWebsites)
  .post(createWebsite);

router.route('/:id')
  .get(getWebsite)
  .put(updateWebsite)
  .delete(deleteWebsite);

// Scan routes
router.post('/:id/scan', runScan);
router.get('/:id/performance', getPerformanceHistory);

export default router;
