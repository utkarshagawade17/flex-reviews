'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview } from '@/types/review';

export default function TestPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testAPIs();
  }, []);

  const testAPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test Hostaway API
      const hostawayResponse = await fetch('/api/reviews/hostaway');
      const hostawayData = await hostawayResponse.json();

      if (hostawayData.success) {
        setReviews(hostawayData.data);
        console.log('Hostaway API test successful:', hostawayData);
      } else {
        setError('Hostaway API test failed: ' + hostawayData.error);
      }
    } catch (err) {
      setError('API test failed: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleAPI = async () => {
    try {
      const response = await fetch('/api/reviews/google?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4');
      const data = await response.json();
      console.log('Google API test result:', data);
      alert('Google API test completed. Check console for results.');
    } catch (err) {
      console.error('Google API test failed:', err);
      alert('Google API test failed. Check console for details.');
    }
  };

  const testApprovedAPI = async () => {
    try {
      const response = await fetch('/api/reviews/approved');
      const data = await response.json();
      console.log('Approved API test result:', data);
      alert('Approved API test completed. Check console for results.');
    } catch (err) {
      console.error('Approved API test failed:', err);
      alert('Approved API test failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testAPIs}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Hostaway API
          </button>
          
          <button
            onClick={testGoogleAPI}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Google API
          </button>
          
          <button
            onClick={testApprovedAPI}
            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Test Approved API
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Testing APIs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hostaway Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{review.guestName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{review.rating}/5</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {review.channel}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{review.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      {review.approved && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Approved
                        </span>
                      )}
                      {review.tags.includes('featured') && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <code className="text-blue-600">GET /api/reviews/hostaway</code>
              <span className="text-gray-600">Fetch all reviews</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <code className="text-blue-600">GET /api/reviews/google</code>
              <span className="text-gray-600">Fetch Google reviews</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <code className="text-blue-600">GET /api/reviews/approved</code>
              <span className="text-gray-600">Fetch approved reviews</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <code className="text-blue-600">PATCH /api/reviews/hostaway</code>
              <span className="text-gray-600">Update review status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
