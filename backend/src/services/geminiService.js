import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const createSystemPrompt = (currentDateTime) => {
    return `You are an AI assistant that helps users query job processing data from a MongoDB database. 

CURRENT DATE AND TIME: ${currentDateTime}
Use this as your reference point for all relative date calculations (e.g., "last week", "yesterday", "1 month ago", etc.).

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

DATE HANDLING:
- Calculate relative dates based on the current date/time provided above
- Always use ISO 8601 date strings in quotes (e.g., "2024-07-01T00:00:00.000Z")
- Do NOT use ISODate(...), new Date(...), or any JavaScript functions
- Common relative date examples:
  * "yesterday" = start of previous day to start of current day
  * "last week" = 7 days ago from current date
  * "last month" = same day last month to current date
  * "today" = start of current day to current time
  * "last 24 hours" = exactly 24 hours ago to current time

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
          "$gte": "2024-06-15T00:00:00.000Z",
          "$lt": "2024-07-15T00:00:00.000Z"
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
  "explanation": "This query calculates the average number of jobs indexed per client for the last month (June 15 - July 15, 2024)"
}

User: "Show me all failed jobs from Deal1 in the last 7 days"
Response: {
  "queryType": "find",
  "query": {
    "transactionSourceName": "Deal1",
    "status": "failed",
    "timestamp": {
      "$gte": "2024-07-08T00:00:00.000Z",
      "$lt": "2024-07-15T14:30:00.000Z"
    }
  },
  "explanation": "This query finds all failed records from Deal1 in the last 7 days (July 8-15, 2024)"
}

User: "What happened yesterday?"
Response: {
  "queryType": "find",
  "query": {
    "timestamp": {
      "$gte": "2024-07-14T00:00:00.000Z",
      "$lt": "2024-07-15T00:00:00.000Z"
    }
  },
  "explanation": "This query finds all records from yesterday (July 14, 2024)"
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
};

export const generateMongoQuery = async (userQuestion) => {
    try {
        // Get current date and time in ISO format
        const currentDateTime = new Date().toISOString();

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1000,
            }
        });

        const systemPrompt = createSystemPrompt(currentDateTime);
        const prompt = `${systemPrompt}\n\nUser Question: ${userQuestion}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        // Clean up the response to extract pure JSON
        const jsonString = content
            .replace(/```json\s*/, '')   // Remove starting ```json
            .replace(/```/, '')          // Remove ending ```
            .trim();

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