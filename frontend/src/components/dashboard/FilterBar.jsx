import React from 'react';

const FilterBar = ({ filters, filterOptions, onFilterChange }) => {
    const handleInputChange = (field, value) => {
        onFilterChange({ [field]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            startDate: '',
            endDate: '',
            client: '',
            country: '',
            status: ''
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Client Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                        value={filters.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Clients</option>
                        {filterOptions.clients.map(client => (
                            <option key={client} value={client}>{client}</option>
                        ))}
                    </select>
                </div>

                {/* Country Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                        value={filters.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Countries</option>
                        {filterOptions.countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        {filterOptions.statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;