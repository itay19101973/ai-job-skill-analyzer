import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

export const useDashboardData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 50,
        hasNextPage: false,
        hasPrevPage: false
    });

    const [filters, setFilters] = useState({
        page: 1,
        limit: 50,
        sortBy: 'timestamp',
        sortOrder: 'desc',
        startDate: '',
        endDate: '',
        client: '',
        country: '',
        status: ''
    });

    const fetchData = useCallback(async (newFilters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = { ...filters, ...newFilters };
            const response = await ApiService.getDashboardData(params);

            setData(response.data);
            setPagination(response.pagination);
            setFilters(params);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, []);

    const updateFilters = useCallback((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 };
        fetchData(updatedFilters);
    }, [fetchData, filters]);

    const changePage = useCallback((page) => {
        fetchData({ ...filters, page });
    }, [fetchData, filters]);

    const changeSort = useCallback((sortBy, sortOrder) => {
        updateFilters({ sortBy, sortOrder });
    }, [updateFilters]);

    return {
        data,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        changePage,
        changeSort,
        refetch: () => fetchData(filters)
    };
};