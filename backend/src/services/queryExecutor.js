import JobLog from '../models/jobLog.js';
import { formatDatesInQueryObject } from '../utils/helpers.js';

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

        const processedQuery = formatDatesInQueryObject(query);

        console.log('Process Query: ', JSON.stringify(processedQuery, null, 4));

        if (queryType === 'aggregate') {
            // Execute aggregation pipeline
            result = await JobLog.aggregate(processedQuery);
        } else if (queryType === 'find') {
            // Execute find query
            result = await JobLog.find(processedQuery).lean();
        } else {
            throw new Error('Invalid query type');
        }

        console.log(result);

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