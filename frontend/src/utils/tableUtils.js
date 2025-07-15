import React from 'react';

// Common sort handler utility
export const createSortHandler = (filters, onSort) => {
    return (field) => {
        if (!onSort) return;
        const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(field, newOrder);
    };
};

// Common sort icon component
export const getSortIcon = (field, filters) => {
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

// Common sortable header component
export const SortableHeader = ({ field, children, filters, onSort }) => {
    const handleSort = createSortHandler(filters, onSort);

    return (
        <th
            onClick={() => handleSort(field)}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors ${
                onSort ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {onSort && getSortIcon(field, filters)}
            </div>
        </th>
    );
};

// Common status badge utility
export const getStatusBadge = (status) => {
    const statusColors = {
        completed: 'bg-green-100 text-green-800',
        success: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        error: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        active: 'bg-blue-100 text-blue-800',
        inactive: 'bg-gray-100 text-gray-800',
        default: 'bg-gray-100 text-gray-800'
    };

    const statusKey = status?.toString().toLowerCase() || 'default';
    const colorClass = statusColors[statusKey] || statusColors.default;

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};