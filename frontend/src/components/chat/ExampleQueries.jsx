import React from 'react';

const ExampleQueries = ({ onSelectQuery, disabled }) => {
    const exampleQueries = [
        "Average jobs indexed per client last month",
        "Show all failed jobs from Deal1",
        "Total jobs processed by country this week",
        "Which client has the highest success rate?",
        "Jobs that failed indexing in the last 7 days",
        "Average processing time by client"
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleQueries.map((query, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectQuery(query)}
                        disabled={disabled}
                        className="text-left p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-start space-x-2">
                            <svg className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{query}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExampleQueries;