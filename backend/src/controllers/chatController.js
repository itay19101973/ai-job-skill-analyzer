import { generateMongoQuery } from '../services/geminiService.js';
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
