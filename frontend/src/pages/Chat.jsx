import React from 'react';
import { useChatQuery } from '../hooks/useChatQuery';
import ChatInput from '../components/chat/ChatInput';
import QueryResult from '../components/chat/QueryResult';
import ExampleQueries from '../components/chat/ExampleQueries';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Chat = () => {
    const { loading, error, queryResult, executeQuery, clearResult } = useChatQuery();

    const handleQuerySubmit = async (question) => {
        await executeQuery(question);
    };

    const handleExampleSelect = (query) => {
        executeQuery(query);
    };

    const handleRetry = () => {
        clearResult();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
                    <p className="mt-2 text-gray-600">
                        Ask natural language questions about job processing data and get insights instantly
                    </p>
                </div>

                <div className="space-y-6">
                    <ChatInput
                        onSubmit={handleQuerySubmit}
                        loading={loading}
                        disabled={loading}
                    />

                    {error && (
                        <ErrorMessage
                            message={error}
                            onRetry={handleRetry}
                        />
                    )}

                    {loading && (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="large" />
                        </div>
                    )}

                    {queryResult && (
                        <QueryResult
                            result={queryResult}
                            onClear={clearResult}
                        />
                    )}

                    {!queryResult && !loading && (
                        <ExampleQueries
                            onSelectQuery={handleExampleSelect}
                            disabled={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;