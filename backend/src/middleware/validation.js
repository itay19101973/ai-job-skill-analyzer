export const validateDashboardQuery = (req, res, next) => {
    const { page, limit, sortBy, sortOrder } = req.query;

    // Validate pagination
    if (page && (isNaN(page) || parseInt(page) < 1)) {
        return res.status(400).json({ error: 'Invalid page number' });
    }

    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 1000)) {
        return res.status(400).json({ error: 'Invalid limit (must be between 1 and 1000)' });
    }

    // Validate sorting
    const validSortFields = [
        'timestamp', 'transactionSourceName', 'country_code', 'status',
        'progress.TOTAL_JOBS_IN_FEED', 'progress.TOTAL_JOBS_SENT_TO_INDEX',
        'progress.TOTAL_JOBS_FAIL_INDEXED', 'recordCount'
    ];

    if (sortBy && !validSortFields.includes(sortBy)) {
        return res.status(400).json({ error: 'Invalid sort field' });
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ error: 'Invalid sort order' });
    }

    // Validate dates
    const { startDate, endDate } = req.query;
    if (startDate && isNaN(Date.parse(startDate))) {
        return res.status(400).json({ error: 'Invalid start date' });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({ error: 'Invalid end date' });
    }

    next();
};