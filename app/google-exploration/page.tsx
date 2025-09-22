'use client';

import { useState } from 'react';
import { Search, MapPin, Star, ExternalLink, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function GoogleExploration() {
  const [placeId, setPlaceId] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!placeId.trim()) {
      setError('Please enter a Place ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/reviews/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: placeId.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to fetch Google reviews');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Reviews Integration</h1>
          <p className="text-gray-600">
            Explore Google Places API integration for fetching and normalizing Google reviews.
          </p>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Integration Status</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">API Key Required</p>
                <p className="text-sm text-gray-600">
                  To use Google Places API, you need to set up a Google Cloud project and enable the Places API.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Rate Limits & Costs</p>
                <p className="text-sm text-gray-600">
                  Google Places API has rate limits and costs per request. Consider caching strategies for production use.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Attribution Required</p>
                <p className="text-sm text-gray-600">
                  Google requires attribution when displaying Places data. This is handled in the UI components.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Interface */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Google Places API</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                  placeholder="Enter Google Place ID (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Place Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {results.place?.name || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {results.place?.formatted_address || 'N/A'}</p>
                    <p><span className="font-medium">Rating:</span> {results.place?.rating || 'N/A'}</p>
                    <p><span className="font-medium">Total Reviews:</span> {results.place?.user_ratings_total || 'N/A'}</p>
                  </div>
                </div>

                {results.reviews && results.reviews.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Reviews ({results.reviews.length})</h3>
                    <div className="space-y-3">
                      {results.reviews.map((review: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {review.author_name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{review.author_name || 'Anonymous'}</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.relative_time_description || 'Unknown time'}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{review.text || 'No review text'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Implementation Guide</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. Google Cloud Setup</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Create a Google Cloud project</li>
                <li>Enable the Places API</li>
                <li>Create API credentials (API Key)</li>
                <li>Set up billing (required for Places API)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Environment Variables</h3>
              <div className="bg-gray-100 p-3 rounded-md">
                <code className="text-sm">GOOGLE_PLACES_API_KEY=your_api_key_here</code>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. Rate Limits & Costs</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Places API: $17 per 1,000 requests</li>
                <li>Place Details: $3 per 1,000 requests</li>
                <li>Rate limit: 1,000 requests per 100 seconds</li>
                <li>Consider implementing caching to reduce costs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">4. Attribution Requirements</h3>
              <p className="text-gray-600">
                Google requires attribution when displaying Places data. Include "Powered by Google" 
                or similar attribution text in your UI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

