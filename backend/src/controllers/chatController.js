import { generateMongoQuery } from '../services/openaiService.js';
import { executeMongoQuery } from '../services/queryExecutor.js';

export const processQuery = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                error: 'Question is required'
            });
        }

        // Step 1: Generate MongoDB query using OpenAI
        const queryData = await generateMongoQuery(question);

        // Step 2: Execute the generated query
        const result = await executeMongoQuery(queryData);

        // Step 3: Return response
        res.json({
            question,
            response: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({
            error: 'Failed to process your question. Please try again.'
        });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        // For now, return empty array since we're not storing chat history
        // In a real app, you'd want to store this in a database
        res.json([]);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

// Helper function to suggest example questions
export const getExampleQuestions = async (req, res) => {
    try {
        const examples = [
            "What's the average number of jobs indexed per client this month?",
            "Show me all failed jobs from Deal1",
            "Which client has the highest success rate?",
            "How many jobs were processed yesterday?",
            "What's the total number of jobs sent to enrich last week?",
            "Show me the top 5 clients by total jobs indexed",
            "What's the failure rate for jobs in the US?",
            "How many unique clients do we have?",
            "Show me all completed jobs from the last 7 days",
            "What's the average record count per transaction?"
        ];

        res.json({ examples });
    } catch (error) {
        console.error('Error fetching examples:', error);
        res.status(500).json({ error: 'Failed to fetch examples' });
    }
};