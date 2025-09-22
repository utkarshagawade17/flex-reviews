'use client';

import { useState } from 'react';
import { MapPin, ExternalLink, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { NormalizedReview } from '@/types/review';

interface GoogleReviewsIntegrationProps {
  propertyId: string;
  propertyName: string;
  onReviewsFetched: (reviews: NormalizedReview[]) => void;
}

export default function GoogleReviewsIntegration({ 
  propertyId, 
  propertyName, 
  onReviewsFetched 
}: GoogleReviewsIntegrationProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConfigureGoogleReviews = async () => {
    if (!placeId.trim()) {
      setStatus('error');
      setMessage('Please enter a Google Place ID');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/reviews/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: placeId.trim(),
          propertyName,
          propertyId
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(`Successfully configured Google Reviews integration. Found ${data.total} reviews.`);
        onReviewsFetched(data.data);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to configure Google Reviews');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to Google Reviews API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchReviews = async () => {
    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`/api/reviews/google?placeId=${placeId}&propertyId=${propertyId}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(`Fetched ${data.total} Google reviews`);
        onReviewsFetched(data.data);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to fetch Google reviews');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to fetch Google reviews');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">G</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Google Reviews Integration</h3>
        </div>
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Configure</span>
        </button>
      </div>

      {isConfiguring && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Place ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                placeholder="Enter Google Place ID (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleConfigureGoogleReviews}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Configuring...' : 'Configure'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Find your Google Place ID using the{' '}
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Places API
              </a>
            </p>
          </div>

          {placeId && (
            <div className="flex space-x-2">
              <button
                onClick={handleFetchReviews}
                disabled={isLoading}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{isLoading ? 'Fetching...' : 'Fetch Reviews'}</span>
              </button>
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Google</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Status Message */}
      {status !== 'idle' && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Status</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center justify-between">
            <span>Google Places API Key:</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              Not Configured
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Place ID:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
              {placeId || 'Not Set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Reviews Fetched:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
              {placeId ? 'Ready' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Get a Google Places API key from the Google Cloud Console</li>
          <li>Enable the Places API for your project</li>
          <li>Find the Google Place ID for your property using the Place ID Finder</li>
          <li>Enter the Place ID above and click "Configure"</li>
          <li>Click "Fetch Reviews" to import Google reviews</li>
        </ol>
      </div>
    </div>
  );
}

