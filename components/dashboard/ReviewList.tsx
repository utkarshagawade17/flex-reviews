'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReviewRow from './ReviewRow';
import { NormalizedReview } from '@/types/review';
import { FilterState } from '@/types/dashboard';

interface ReviewListProps {
  filters: FilterState;
  selectedReviews: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onReviewSelect: (review: NormalizedReview) => void;
  selectedReview: NormalizedReview | null;
  density: 'comfortable' | 'compact';
}

export default function ReviewList({
  filters,
  selectedReviews,
  onSelectionChange,
  onReviewSelect,
  selectedReview,
  density
}: ReviewListProps) {
  const [cursor, setCursor] = useState<string | undefined>();

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (filters.q) queryParams.append('q', filters.q);
  if (filters.source?.length) queryParams.append('source', filters.source.join(','));
  if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
  if (filters.type?.length) queryParams.append('type', filters.type.join(','));
  if (filters.ratingMin) queryParams.append('ratingMin', filters.ratingMin.toString());
  if (filters.sort) queryParams.append('sort', filters.sort);
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (cursor) queryParams.append('cursor', cursor);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data?.data?.reviews || [];
  const hasMore = data?.data?.cursor;
  const totalCount = data?.data?.count || 0;

  const handleSelectAll = () => {
    if (selectedReviews.size === reviews.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(reviews.map((r: NormalizedReview) => `${r.source}:${r.id}`)));
    }
  };

  const handleSelectReview = (review: NormalizedReview, selected: boolean) => {
    const reviewKey = `${review.source}:${review.id}`;
    const newSelection = new Set(selectedReviews);
    if (selected) {
      newSelection.add(reviewKey);
    } else {
      newSelection.delete(reviewKey);
    }
    onSelectionChange(newSelection);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setCursor(hasMore);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load reviews</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No reviews found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedReviews.size === reviews.length && reviews.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`${density === 'compact' ? 'space-y-1' : 'space-y-2'} p-4`}>
          {reviews.map((review: NormalizedReview) => (
            <ReviewRow
              key={`${review.source}:${review.id}`}
              review={review}
              selected={selectedReviews.has(`${review.source}:${review.id}`)}
              active={selectedReview?.id === review.id && selectedReview?.source === review.source}
              onSelect={(selected) => handleSelectReview(review, selected)}
              onClick={() => onReviewSelect(review)}
              density={density}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
