'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const testCanonicalApi = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error testing API:', error);
      setResults({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    'q=wifi&source=hostaway',
    'tags=cleanliness,location&sort=rating_desc',
    'type=host_to_guest&ratingMin=4',
    'listingId=1&limit=10',
    'source=hostaway,google&sort=newest&limit=5'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Canonical Reviews API Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoint</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query Parameters
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="q=wifi&source=hostaway&sort=rating_desc"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={testCanonicalApi}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Example Queries</h2>
          <div className="space-y-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-mono"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Response</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Canonical API Features</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>q</strong>: Search query (guest name, review text, property)</li>
            <li>• <strong>source</strong>: Comma-separated sources (hostaway,google)</li>
            <li>• <strong>listingId</strong>: Filter by specific property</li>
            <li>• <strong>tags</strong>: Comma-separated tags (wifi,cleanliness)</li>
            <li>• <strong>type</strong>: Review types (host_to_guest,guest_to_host)</li>
            <li>• <strong>ratingMin/ratingMax</strong>: Rating range filters</li>
            <li>• <strong>sort</strong>: newest,oldest,rating_desc,rating_asc</li>
            <li>• <strong>limit</strong>: Number of results (max 100)</li>
            <li>• <strong>cursor</strong>: Pagination cursor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

