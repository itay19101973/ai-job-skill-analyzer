import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useFilterOptions } from '../hooks/useFilterOptions';
import FilterBar from '../components/dashboard/FilterBar';
import DataTable from '../components/dashboard/DataTable';
import Pagination from '../components/dashboard/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
    const {
        data,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        changePage,
        changeSort,
        refetch
    } = useDashboardData();

    const { filterOptions } = useFilterOptions();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Monitor and analyze job processing logs across all clients
                    </p>
                </div>

                <FilterBar
                    filters={filters}
                    filterOptions={filterOptions}
                    onFilterChange={updateFilters}
                />

                {error && (
                    <ErrorMessage
                        message={error}
                        onRetry={refetch}
                    />
                )}

                {loading ? (
                    <LoadingSpinner size="large" />
                ) : (
                    <>
                        <DataTable
                            data={data}
                            filters={filters}
                            onSort={changeSort}
                        />

                        {pagination.totalCount > 0 && (
                            <Pagination
                                pagination={pagination}
                                onPageChange={changePage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;