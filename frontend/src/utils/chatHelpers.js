export const formatQueryResponse = (response) => {
    if (!response || !response.data) {
        return null;
    }

    // If the response data is aggregated results (like averages, counts)
    // we might need to format it differently than raw job logs
    if (Array.isArray(response.data) && response.data.length > 0) {
        const firstItem = response.data[0];

        // Check if this looks like aggregated data
        if (firstItem._id && !firstItem.timestamp) {
            // This is likely aggregated data, we need to transform it
            // to work with our DataTable component
            return response.data.map((item, index) => ({
                _id: item._id || `aggregated_${index}`,
                transactionSourceName: item._id || 'Aggregated',
                country_code: item.country_code || 'N/A',
                status: 'aggregated',
                timestamp: new Date().toISOString(),
                progress: {
                    TOTAL_JOBS_IN_FEED: item.totalJobsInFeed || 0,
                    TOTAL_JOBS_SENT_TO_INDEX: item.avgJobsIndexed || item.totalJobsIndexed || 0,
                    TOTAL_JOBS_FAIL_INDEXED: item.totalJobsFailed || 0,
                },
                recordCount: item.totalRecords || 0,
                // Add any other aggregated fields
                ...item
            }));
        }
    }

    return response.data;
};