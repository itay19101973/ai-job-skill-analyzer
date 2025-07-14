import React from 'react';
import { formatDate, formatNumber } from '../../utils/formatters';

const DataTable = ({ data, filters, onSort }) => {
    const handleSort = (field) => {
        const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(field, newOrder);
    };

    const getSortIcon = (field) => {
        if (filters.sortBy !== field) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return filters.sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const SortableHeader = ({ field, children }) => (
        <th
            onClick={() => handleSort(field)}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {getSortIcon(field)}
            </div>
        </th>
    );

    const getStatusBadge = (status) => {
        const statusColors = {
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            default: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status] || statusColors.default}`}>
        {status}
      </span>
        );
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No data found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <SortableHeader field="timestamp">Timestamp</SortableHeader>
                        <SortableHeader field="transactionSourceName">Client</SortableHeader>
                        <SortableHeader field="country_code">Country</SortableHeader>
                        <SortableHeader field="status">Status</SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_IN_FEED">Jobs in Feed</SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_SENT_TO_INDEX">Jobs Indexed</SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_FAIL_INDEXED">Jobs Failed</SortableHeader>
                        <SortableHeader field="recordCount">Record Count</SortableHeader>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Success Rate
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((record) => {
                        const successRate = record.progress?.TOTAL_JOBS_IN_FEED > 0
                            ? ((record.progress.TOTAL_JOBS_SENT_TO_INDEX / record.progress.TOTAL_JOBS_IN_FEED) * 100).toFixed(1)
                            : '0';

                        return (
                            <tr key={record._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(record.timestamp)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.transactionSourceName}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.country_code}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getStatusBadge(record.status)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(record.progress?.TOTAL_JOBS_IN_FEED || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(record.progress?.TOTAL_JOBS_SENT_TO_INDEX || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(record.progress?.TOTAL_JOBS_FAIL_INDEXED || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(record.recordCount || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${Math.min(successRate, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs">{successRate}%</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;