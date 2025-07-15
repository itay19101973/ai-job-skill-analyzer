import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an AI assistant that helps users query job processing data from a MongoDB database. 

DATABASE SCHEMA:
Collection: "joblogs"
Fields:
- _id: String
- country_code: String (e.g., "US", "UK", "CA")
- currency_code: String (e.g., "USD", "GBP", "CAD")
- progress: Object with fields:
  - SWITCH_INDEX: Boolean
  - TOTAL_RECORDS_IN_FEED: Number
  - TOTAL_JOBS_FAIL_INDEXED: Number
  - TOTAL_JOBS_IN_FEED: Number
  - TOTAL_JOBS_SENT_TO_ENRICH: Number
  - TOTAL_JOBS_DONT_HAVE_METADATA: Number
  - TOTAL_JOBS_DONT_HAVE_METADATA_V2: Number
  - TOTAL_JOBS_SENT_TO_INDEX: Number
- status: String (e.g., "completed", "failed", "pending")
- timestamp: Date
- transactionSourceName: String (client names like "Deal1", "Deal2", etc.)
- noCoordinatesCount: Number
- recordCount: Number
- uniqueRefNumberCount: Number

INSTRUCTIONS:
1. Convert user questions into MongoDB aggregation pipelines or find queries
2. Return ONLY valid MongoDB query syntax that can be executed directly
3. Use proper MongoDB operators like $match, $group, $sort, $limit, $avg, $sum, etc.
4. For date queries, use proper date comparison operators
5. Always include error handling for edge cases
6. If the query requires aggregation, use the aggregate pipeline format
7. If it's a simple find, use the find query format

RESPONSE FORMAT:
Return your response as a JSON object with:
{
  "queryType": "aggregate" | "find",
  "query": [mongodb query here],
  "explanation": "Brief explanation of what the query does"
}

EXAMPLES:
User: "Average TOTAL_JOBS_SENT_TO_INDEX per client last month?"
Response: {
  "queryType": "aggregate",
  "query": [
    {
      "$match": {
        "timestamp": {
          "$gte": new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          "$lt": new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    },
    {
      "$group": {
        "_id": "$transactionSourceName",
        "avgJobsIndexed": { "$avg": "$progress.TOTAL_JOBS_SENT_TO_INDEX" },
        "totalRecords": { "$sum": 1 }
      }
    },
    {
      "$sort": { "avgJobsIndexed": -1 }
    }
  ],
  "explanation": "This query calculates the average number of jobs indexed per client for the last month"
}

User: "Show me all failed jobs from Deal1"
Response: {
  "queryType": "find",
  "query": {
    "transactionSourceName": "Deal1",
    "status": "failed"
  },
  "explanation": "This query finds all records where the client is Deal1 and status is failed"
}

IMPORTANT: Return valid JSON only.
Use ISO 8601 date strings in quotes (e.g., "2024-07-01T00:00:00.000Z").
Do NOT use ISODate(...), new Date(...), or any code functions.

Example:
{
  "$gte": "2025-07-01T00:00:00.000Z",
  "$lt": "2025-08-01T00:00:00.000Z"
}

If the user's prompt is invalid or inappropriate, return a appropriate error message but keep the JSON structure.
Error Example:
{
  "queryType": "error",
  "query": null,
  "explanation": "Inappropriate language detected. Please rephrase your query."
}
`;

export const generateMongoQuery = async (userQuestion) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1000,
            }
        });

        const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userQuestion}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        // Clean up the response to extract pure JSON
        const jsonString = content
            .replace(/```json\s*/, '')   // Remove starting ```json
            .replace(/```/, '')          // Remove ending ```
            .trim();

        console.log('Received Content:', content);

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.warn('Failed to parse Gemini response as JSON:', parseError);
            console.warn('Content:', content);
            return {
                queryType: 'error',
                query: null,
                explanation: 'Failed to parse the generated query. Please try rephrasing your question.'
            };
        }

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate query. Please try again.');
    }
};