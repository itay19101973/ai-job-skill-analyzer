import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
}`;

export const generateMongoQuery = async (userQuestion) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userQuestion }
            ],
            temperature: 0.1,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        // Try to parse the JSON response
        try {
            const parsedResponse = JSON.parse(content);
            return parsedResponse;
        } catch (parseError) {
            // If JSON parsing fails, try to extract query from the response
            console.warn('Failed to parse OpenAI response as JSON:', parseError);
            return {
                queryType: 'error',
                query: null,
                explanation: 'Failed to parse the generated query. Please try rephrasing your question.'
            };
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to generate query. Please try again.');
    }
};