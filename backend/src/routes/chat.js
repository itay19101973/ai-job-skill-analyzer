import express from 'express';
import { processQuery, getChatHistory, getExampleQuestions } from '../controllers/chatController.js';

const router = express.Router();

// Process a chat query
router.post('/query', processQuery);

// Get chat history (placeholder for future implementation)
router.get('/history', getChatHistory);

// Get example questions
router.get('/examples', getExampleQuestions);

export default router;