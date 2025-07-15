import React, { useState, useMemo } from 'react';
import QueryDataTable from './QueryDataTable';
import Pagination from '../dashboard/Pagination';

const QueryResult = ({ result, onClear }) => {
    const { data, explanation, queryType, recordCount } = result;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Fixed page size for chat results
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    // Sort data if sorting is applied
    const sortedData = useMemo(() => {
        if (!data || data.length === 0 || !sortBy) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            // Handle null/undefined values
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            // Handle numeric values
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }

            // Handle string values
            const aStr = aVal.toString().toLowerCase();
            const bStr = bVal.toString().toLowerCase();

            if (sortOrder === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [data, sortBy, sortOrder]);

    // Calculate pagination data
    const pagination = useMemo(() => {
        if (!sortedData || sortedData.length === 0) {
            return {
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                limit: pageSize,
                hasNextPage: false,
                hasPrevPage: false
            };
        }

        const totalPages = Math.ceil(sortedData.length / pageSize);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        return {
            currentPage,
            totalPages,
            totalCount: sortedData.length,
            limit: pageSize,
            hasNextPage,
            hasPrevPage
        };
    }, [sortedData, currentPage, pageSize]);

    // Get current page data
    const currentPageData = useMemo(() => {
        if (!sortedData || sortedData.length === 0) return [];

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Reset pagination when sorting changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, sortOrder]);

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Query Result</h3>
                        <p className="text-blue-800">{explanation}</p>
                        <div className="mt-2 text-sm text-blue-700">
                            <span className="font-medium">Query Type:</span> {queryType} |
                            <span className="font-medium"> Records:</span> {recordCount}
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Clear result"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {data && data.length > 0 ? (
                    <>
                        <QueryDataTable
                            data={currentPageData}
                            filters={{ sortBy, sortOrder }}
                            onSort={handleSort}
                        />

                        {pagination.totalPages > 1 && (
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No data returned from this query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryResult;