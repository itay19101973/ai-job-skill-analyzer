import { useState } from 'react';
import ApiService from '../services/api';

export const useChatQuery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [queryResult, setQueryResult] = useState(null);

    const executeQuery = async (question) => {
        setLoading(true);
        setError(null);
        setQueryResult(null);

        try {
            const data = await ApiService.chatQuery(question);

            if (data.response && data.response.success) {
                setQueryResult(data.response);
            } else {
                setError(data.response?.error || 'Failed to execute query');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while processing your query');
        } finally {
            setLoading(false);
        }
    };

    const clearResult = () => {
        setQueryResult(null);
        setError(null);
    };

    return {
        loading,
        error,
        queryResult,
        executeQuery,
        clearResult
    };
};