export const formatChatResponse = (result) => {
    const { data, explanation, queryType, recordCount } = result;

    if (!result.success) {
        return {
            type: 'error',
            message: result.error,
            data: null
        };
    }

    // Format response based on data type
    if (queryType === 'aggregate') {
        return {
            type: 'chart', // Can be used by frontend to decide rendering
            message: explanation,
            data: data,
            recordCount,
            summary: generateSummary(data)
        };
    } else if (queryType === 'find') {
        return {
            type: 'table',
            message: explanation,
            data: data,
            recordCount,
            summary: `Found ${recordCount} records`
        };
    }

    return {
        type: 'text',
        message: explanation,
        data: data,
        recordCount
    };
};

const generateSummary = (data) => {
    if (!data || data.length === 0) return 'No data found';

    if (data.length === 1 && typeof data[0] === 'object') {
        // Single aggregation result
        const keys = Object.keys(data[0]);
        if (keys.includes('_id') && keys.length === 2) {
            // Simple group by result
            return `Found ${data.length} group(s)`;
        }
    }

    return `Processed ${data.length} record(s)`;
};