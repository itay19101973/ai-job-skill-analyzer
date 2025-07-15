import JobLog from '../models/JobLog.js';

export const executeMongoQuery = async (queryData) => {
    try {
        const { queryType, query, explanation } = queryData;

        if (queryType === 'error') {
            return {
                success: false,
                error: explanation,
                data: null
            };
        }

        let result;

        if (queryType === 'aggregate') {
            // Execute aggregation pipeline
            result = await JobLog.aggregate(query);
        } else if (queryType === 'find') {
            // Execute find query with limit for safety
            result = await JobLog.find(query).limit(100).lean();
        } else {
            throw new Error('Invalid query type');
        }

        return {
            success: true,
            data: result,
            explanation,
            queryType,
            recordCount: Array.isArray(result) ? result.length : 1
        };
    } catch (error) {
        console.error('Query execution error:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};