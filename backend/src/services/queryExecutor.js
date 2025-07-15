import JobLog from '../models/jobLog.js';

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
            // Execute find query
            result = await JobLog.find(query).lean();
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