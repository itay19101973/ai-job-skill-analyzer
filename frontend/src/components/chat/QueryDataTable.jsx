import React from 'react';
import { formatDate, formatNumber } from '../../utils/formatters';
import { SortableHeader, getStatusBadge } from '../../utils/tableUtils';

const QueryDataTable = ({ data, filters = {}, onSort }) => {

    // Generate columns dynamically based on data structure
    const generateColumns = () => {
        if (!data || data.length === 0) return [];

        // Get all unique keys from all objects
        const allKeys = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
        });

        return Array.from(allKeys).map(key => ({
            key,
            label: formatColumnLabel(key),
            sortable: true
        }));
    };

    // Format column labels to be more readable
    const formatColumnLabel = (key) => {
        // Handle common patterns
        const labelMap = {
            '_id': 'ID',
            'avgJobsIndexed': 'Avg Jobs Indexed',
            'transactionSourceName': 'Client',
            'country_code': 'Country',
            'recordCount': 'Record Count',
            'timestamp': 'Timestamp',
            'status': 'Status'
        };

        if (labelMap[key]) {
            return labelMap[key];
        }

        // Convert camelCase and snake_case to readable format
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
            .trim();
    };

    // Format cell values based on data type and key patterns
    const formatCellValue = (value, key) => {
        if (value === null || value === undefined) {
            return '-';
        }

        // Handle nested objects (like progress.TOTAL_JOBS_IN_FEED)
        if (typeof value === 'object' && !Array.isArray(value)) {
            return JSON.stringify(value);
        }

        // Handle arrays
        if (Array.isArray(value)) {
            return value.join(', ');
        }

        // Handle specific patterns
        if (key === 'timestamp' || key.includes('date') || key.includes('time')) {
            return formatDate(value);
        }

        // Handle numeric values
        if (typeof value === 'number') {
            // If it's a percentage-like value or very small decimal
            if (value < 1 && value > 0) {
                return (value * 100).toFixed(2) + '%';
            }
            // For large numbers, use number formatting
            if (value > 1000) {
                return formatNumber(value);
            }
            // For regular numbers, show up to 2 decimal places
            return value % 1 !== 0 ? value.toFixed(2) : value.toString();
        }

        // Handle boolean values
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        // Handle status-like fields
        if (key === 'status' || key.includes('status')) {
            return getStatusBadge(value);
        }

        // Default string handling
        return value.toString();
    };

    const columns = generateColumns();

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No data found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map(column => (
                            <SortableHeader key={column.key} field={column.key} filters={filters} onSort={onSort}>
                                {column.label}
                            </SortableHeader>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((record, index) => (
                        <tr key={record._id || record.id || index} className="hover:bg-gray-50">
                            {columns.map(column => (
                                <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCellValue(record[column.key], column.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QueryDataTable;