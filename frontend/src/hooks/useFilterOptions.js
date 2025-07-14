import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useFilterOptions = () => {
    const [filterOptions, setFilterOptions] = useState({
        clients: [],
        countries: [],
        statuses: [],
        dateRange: { minDate: null, maxDate: null }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            setLoading(true);
            try {
                const options = await ApiService.getFilterOptions();
                setFilterOptions(options);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    return { filterOptions, loading, error };
};