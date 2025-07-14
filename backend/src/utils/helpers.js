export const calculateMetrics = (data) => {
    if (!data || data.length === 0) return {};

    const metrics = data.reduce((acc, record) => {
        const progress = record.progress || {};

        acc.totalRecords += 1;
        acc.totalJobsInFeed += progress.TOTAL_JOBS_IN_FEED || 0;
        acc.totalJobsIndexed += progress.TOTAL_JOBS_SENT_TO_INDEX || 0;
        acc.totalJobsFailed += progress.TOTAL_JOBS_FAIL_INDEXED || 0;
        acc.totalJobsEnriched += progress.TOTAL_JOBS_SENT_TO_ENRICH || 0;

        return acc;
    }, {
        totalRecords: 0,
        totalJobsInFeed: 0,
        totalJobsIndexed: 0,
        totalJobsFailed: 0,
        totalJobsEnriched: 0
    });

    // Calculate averages and rates
    metrics.avgJobsInFeed = metrics.totalJobsInFeed / metrics.totalRecords;
    metrics.avgJobsIndexed = metrics.totalJobsIndexed / metrics.totalRecords;
    metrics.avgJobsFailed = metrics.totalJobsFailed / metrics.totalRecords;
    metrics.successRate = metrics.totalJobsInFeed > 0 ?
        (metrics.totalJobsIndexed / metrics.totalJobsInFeed) * 100 : 0;

    return metrics;
};