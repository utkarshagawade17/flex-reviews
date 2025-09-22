'use client';

import { useState } from 'react';

export default function ComprehensiveApiTestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(true);
    setActiveTest(testName);
    try {
      const result = await testFunction();
      setResults({ testName, result });
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
      setResults({ testName, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  };

  const tests = [
    {
      name: 'Canonical Reviews API',
      description: 'GET /api/reviews with comprehensive filtering',
      test: async () => {
        const response = await fetch('/api/reviews?source=hostaway,google&sort=newest&limit=5');
        return await response.json();
      }
    },
    {
      name: 'Single Review PATCH',
      description: 'PATCH /api/reviews/:source/:reviewId',
      test: async () => {
        const response = await fetch('/api/reviews/hostaway/1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true, selectedForWeb: true })
        });
        return await response.json();
      }
    },
    {
      name: 'Bulk Approve',
      description: 'POST /api/reviews/bulk-approve',
      test: async () => {
        const response = await fetch('/api/reviews/bulk-approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              { source: 'hostaway', reviewId: '1' },
              { source: 'hostaway', reviewId: '2' }
            ],
            value: true
          })
        });
        return await response.json();
      }
    },
    {
      name: 'Bulk Show',
      description: 'POST /api/reviews/bulk-show',
      test: async () => {
        const response = await fetch('/api/reviews/bulk-show', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              { source: 'hostaway', reviewId: '1' },
              { source: 'google', reviewId: '101' }
            ],
            value: true
          })
        });
        return await response.json();
      }
    },
    {
      name: 'Tags API',
      description: 'GET /api/reviews/tags',
      test: async () => {
        const response = await fetch('/api/reviews/tags');
        return await response.json();
      }
    },
    {
      name: 'Add Tag to Review',
      description: 'POST /api/reviews/:source/:id/tags',
      test: async () => {
        const response = await fetch('/api/reviews/hostaway/1/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag: 'wifi' })
        });
        return await response.json();
      }
    },
    {
      name: 'Remove Tag from Review',
      description: 'DELETE /api/reviews/:source/:id/tags/:tag',
      test: async () => {
        const response = await fetch('/api/reviews/hostaway/1/tags/wifi', {
          method: 'DELETE'
        });
        return await response.json();
      }
    },
    {
      name: 'Approved Feed',
      description: 'GET /api/reviews/approved',
      test: async () => {
        const response = await fetch('/api/reviews/approved');
        return await response.json();
      }
    },
    {
      name: 'Trends Analytics',
      description: 'GET /api/reviews/trends',
      test: async () => {
        const response = await fetch('/api/reviews/trends?range=180d');
        return await response.json();
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Comprehensive API Test Suite</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Test all the new API endpoints with real requests and responses.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Buttons */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Tests</h2>
            {tests.map((test, index) => (
              <button
                key={index}
                onClick={() => runTest(test.name, test.test)}
                disabled={loading}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  loading && activeTest === test.name
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{test.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                  </div>
                  {loading && activeTest === test.name && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Test Results</h2>
            {results ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{results.testName}</h3>
                  <div className={`inline-block px-2 py-1 rounded text-sm ${
                    results.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {results.error ? 'Error' : 'Success'}
                  </div>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  {JSON.stringify(results.result || results.error, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Select a test to see results</p>
            )}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">API Endpoints Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Core Endpoints</h3>
              <ul className="space-y-1 text-blue-800">
                <li>• <code>GET /api/reviews</code> - Canonical list with filters</li>
                <li>• <code>PATCH /api/reviews/:source/:id</code> - Single review update</li>
                <li>• <code>GET /api/reviews/approved</code> - Approved reviews feed</li>
                <li>• <code>GET /api/reviews/trends</code> - Analytics data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Bulk & Tags</h3>
              <ul className="space-y-1 text-blue-800">
                <li>• <code>POST /api/reviews/bulk-approve</code> - Bulk approve</li>
                <li>• <code>POST /api/reviews/bulk-show</code> - Bulk show on web</li>
                <li>• <code>GET /api/reviews/tags</code> - Available tags</li>
                <li>• <code>POST /api/reviews/:source/:id/tags</code> - Add tag</li>
                <li>• <code>DELETE /api/reviews/:source/:id/tags/:tag</code> - Remove tag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
