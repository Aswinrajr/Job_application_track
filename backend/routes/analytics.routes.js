import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getDailyAnalytics,
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getStatusDistribution,
    getDashboardSummary,
} from '../controllers/analytics.controller.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly', getMonthlyAnalytics);
router.get('/status', getStatusDistribution);
router.get('/summary', getDashboardSummary);

export default router;
