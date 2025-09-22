'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import Filters from '@/components/dashboard/Filters';
import ReviewList from '@/components/dashboard/ReviewList';
import DetailPanel from '@/components/dashboard/DetailPanel';
import Trends from '@/components/dashboard/Trends';
import { NormalizedReview } from '@/types/review';
import { FilterState } from '@/types/dashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const defaultFilters: FilterState = {
  source: ['hostaway', 'google'],
  sort: 'newest',
  limit: 20,
};

function DashboardContent() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [selectedReview, setSelectedReview] = useState<NormalizedReview | null>(null);
  const [showBulkBar, setShowBulkBar] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Load density preference from localStorage
  useEffect(() => {
    const savedDensity = localStorage.getItem('review-density');
    if (savedDensity === 'compact' || savedDensity === 'comfortable') {
      setDensity(savedDensity);
    }
  }, []);

  // Save density preference to localStorage
  useEffect(() => {
    localStorage.setItem('review-density', density);
  }, [density]);

  // Debug selectedReview changes
  useEffect(() => {
    console.log('Dashboard: selectedReview changed to:', selectedReview);
  }, [selectedReview]);

  // Show bulk bar when reviews are selected
  useEffect(() => {
    setShowBulkBar(selectedReviews.size > 0);
  }, [selectedReviews]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Only reset selection for major filter changes, not search queries
    if (newFilters.source || newFilters.tags || newFilters.type || newFilters.ratingMin) {
      setSelectedReviews(new Set());
      setSelectedReview(null);
    }
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSelectedReviews(new Set());
    setSelectedReview(null);
  };

  const handleReviewSelect = (review: NormalizedReview) => {
    console.log('Dashboard: Review selected:', review);
    setSelectedReview(review);
    console.log('Dashboard: selectedReview state set to:', review);
  };

  const handleBulkAction = (action: string, value: boolean) => {
    // Implementation will be in the bulk action components
    console.log('Bulk action:', action, value, Array.from(selectedReviews));
  };

  const handleTagAction = (action: 'add' | 'remove', tag: string) => {
    // Implementation will be in the bulk action components
    console.log('Tag action:', action, tag, Array.from(selectedReviews));
  };

  return (
    <div className="min-h-screen w-full max-w-none bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reviews Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage and approve guest reviews
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value as 'comfortable' | 'compact')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] w-full max-w-none">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Center Column - Review List */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Trends Strip */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
            <Trends />
          </div>

          {/* Review List */}
          <div className="flex-1 overflow-hidden h-full">
            <ReviewList
              filters={filters}
              selectedReviews={selectedReviews}
              onSelectionChange={setSelectedReviews}
              onReviewSelect={handleReviewSelect}
              selectedReview={selectedReview}
              density={density}
            />
          </div>
        </div>

        {/* Right Panel - Detail */}
        <div className="w-96 min-w-96 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <DetailPanel
            key={selectedReview ? `review-${selectedReview.source}-${selectedReview.id}` : 'no-review'}
            review={selectedReview}
            onReviewUpdate={(reviewId, updates) => {
              console.log('Review update:', reviewId, updates);
              // Invalidate queries to trigger refetch
              queryClient.invalidateQueries({ queryKey: ['reviews'] });
              queryClient.invalidateQueries({ queryKey: ['trends'] });
              // Force a refetch of the current review list
              queryClient.refetchQueries({ queryKey: ['reviews'] });
            }}
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkBar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-6 py-3 z-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {selectedReviews.size} selected
            </span>
            <button
              onClick={() => handleBulkAction('approve', true)}
              className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('approve', false)}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleBulkAction('showOnWeb', true)}
              className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
            >
              Show on Web
            </button>
            <button
              onClick={() => handleBulkAction('showOnWeb', false)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
            >
              Hide from Web
            </button>
            <button
              onClick={() => setSelectedReviews(new Set())}
              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}