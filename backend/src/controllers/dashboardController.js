import JobLog from '../models/jobLog.js';

export const getDashboardData = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            sortBy = 'timestamp',
            sortOrder = 'desc',
            startDate,
            endDate,
            client,
            country,
            status
        } = req.query;

        // Build filter object
        const filter = {};

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        if (client) filter.transactionSourceName = client;
        if (country) filter.country_code = country;
        if (status) filter.status = status;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [data, totalCount] = await Promise.all([
            JobLog.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            JobLog.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.json({
            data,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                limit: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getFilterOptions = async (req, res) => {
    try {
        const [clients, countries, statuses] = await Promise.all([
            JobLog.distinct('transactionSourceName'),
            JobLog.distinct('country_code'),
            JobLog.distinct('status')
        ]);

        // Get date range
        const dateRange = await JobLog.aggregate([
            {
                $group: {
                    _id: null,
                    minDate: { $min: '$timestamp' },
                    maxDate: { $max: '$timestamp' }
                }
            }
        ]);

        res.json({
            clients: clients.sort(),
            countries: countries.sort(),
            statuses: statuses.sort(),
            dateRange: dateRange[0] || { minDate: null, maxDate: null }
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};