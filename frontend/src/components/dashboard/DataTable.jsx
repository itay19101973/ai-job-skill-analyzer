import React from 'react';
import { formatDate, formatNumber } from '../../utils/formatters';
import { SortableHeader, getStatusBadge } from '../../utils/tableUtils';

const DataTable = ({ data, filters, onSort }) => {
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
                        <SortableHeader field="timestamp" filters={filters} onSort={onSort}>
                            Timestamp
                        </SortableHeader>
                        <SortableHeader field="transactionSourceName" filters={filters} onSort={onSort}>
                            Client
                        </SortableHeader>
                        <SortableHeader field="country_code" filters={filters} onSort={onSort}>
                            Country
                        </SortableHeader>
                        <SortableHeader field="status" filters={filters} onSort={onSort}>
                            Status
                        </SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_IN_FEED" filters={filters} onSort={onSort}>
                            Jobs in Feed
                        </SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_SENT_TO_INDEX" filters={filters} onSort={onSort}>
                            Jobs Indexed
                        </SortableHeader>
                        <SortableHeader field="progress.TOTAL_JOBS_FAIL_INDEXED" filters={filters} onSort={onSort}>
                            Jobs Failed
                        </SortableHeader>
                        <SortableHeader field="recordCount" filters={filters} onSort={onSort}>
                            Record Count
                        </SortableHeader>
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