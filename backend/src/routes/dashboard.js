import express from 'express';
import { getDashboardData, getFilterOptions } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/data', getDashboardData);
router.get('/filter-options', getFilterOptions);

export default router;