import express from 'express';
import { processQuery } from '../controllers/chatController.js';

const router = express.Router();

// Process a chat query
router.post('/query', processQuery);

export default router;