'use client';

import { Star, MapPin, ChevronRight } from 'lucide-react';
import { NormalizedReview } from '@/types/review';
import { safeFormatDate } from '@/utils/date';
import { PREDEFINED_TAGS } from '@/config/tags';
import TagChip from './TagChip';

interface ReviewListProps {
  reviews: NormalizedReview[];
  selectedReview: NormalizedReview | null;
  onReviewSelect: (review: NormalizedReview) => void;
  loading: boolean;
}

export default function ReviewList({ reviews, selectedReview, onReviewSelect, loading }: ReviewListProps) {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'google':
        return <span className="text-blue-600 font-bold text-sm">G</span>;
      case 'airbnb':
        return <span className="text-pink-600 font-bold text-sm">A</span>;
      case 'booking':
        return <span className="text-blue-600 font-bold text-sm">B</span>;
      default:
        return <span className="text-gray-600 font-bold text-sm">H</span>;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Date Range Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {safeFormatDate(new Date(), 'dd MMM')} - {safeFormatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd MMM')}
          </p>
          {reviews.length > 0 && (
            <span className="text-sm text-gray-500">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 p-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No reviews found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div
                key={review.id}
                onClick={() => onReviewSelect(review)}
                className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedReview?.id === review.id ? 'bg-primary-50 border-r-2 border-primary-600' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {review.guestName?.charAt(0) || '?'}
                    </span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {review.guestName || 'Anonymous'}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getChannelIcon(review.channel)}
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-2">
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
                      <span className="text-sm font-medium text-gray-900">
                        {review.rating || 0}/5
                      </span>
                    </div>

                    {/* Review Text Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {review.text}
                    </p>


                    {/* Tags */}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {review.tags.map(tag => (
                          <TagChip key={tag} tag={tag} size="sm" />
                        ))}
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{safeFormatDate(review.submittedAt, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {review.approved && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Approved
                          </span>
                        )}
                        {review.selectedForWeb && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Featured
                          </span>
                        )}
                        <span className="text-gray-400">Assign to You</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
