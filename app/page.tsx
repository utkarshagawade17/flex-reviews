'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, Calendar, User, MessageSquare, Filter, Search } from 'lucide-react';
import ReviewList from '@/components/ReviewList';
import ReviewDetail from '@/components/ReviewDetail';
import Sidebar from '@/components/Sidebar';
import { NormalizedReview, ReviewFilters, DashboardStats } from '@/types/review';
import { FilterState } from '@/types/dashboard';

export default function HomePage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<NormalizedReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    source: ['hostaway', 'google'],
    ratingMin: 0,
    sort: 'newest',
    limit: 20
  });

  // Convert FilterState to ReviewFilters for legacy components
  const convertToReviewFilters = (filters: FilterState): ReviewFilters => ({
    source: filters.source?.join(','),
    rating: filters.ratingMin,
    sortBy: filters.sort as 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating'
  });

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.source && filters.source.length > 0) {
        queryParams.append('source', filters.source.join(','));
      }
      if (filters.ratingMin && filters.ratingMin > 0) {
        queryParams.append('ratingMin', filters.ratingMin.toString());
      }
      if (filters.sort) {
        queryParams.append('sort', filters.sort);
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(`/api/reviews?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.reviews || []);
      } else {
        console.error('Failed to fetch reviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSelect = (review: NormalizedReview) => {
    setSelectedReview(review);
  };

  const handleReviewUpdate = (reviewId: string) => {
    // Refresh the reviews list after an update
    fetchReviews();
    // Clear selection if the updated review was selected
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage and approve guest reviews</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              stats={{
                totalReviews: reviews.length,
                averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0,
                pendingReviews: reviews.filter(r => r.status === 'pending').length,
                featuredReviews: reviews.filter(r => r.tags.includes('featured')).length,
                myReviews: reviews.filter(r => r.guestName?.includes('Manager')).length,
                assignedReviews: reviews.filter(r => r.tags.includes('assigned')).length,
                closedReviews: reviews.filter(r => r.status === 'hidden').length,
                spamReviews: reviews.filter(r => r.tags.includes('spam')).length
              }}
              filters={convertToReviewFilters(filters)}
              onFilterChange={(newFilters) => {
                setFilters(prev => ({
                  ...prev,
                  source: newFilters.source ? newFilters.source.split(',') : prev.source,
                  ratingMin: newFilters.rating,
                  sort: newFilters.sortBy,
                  limit: prev.limit
                }));
              }}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reviews List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reviews ({reviews.length})
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Density:</span>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>Comfortable</option>
                      <option>Compact</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ReviewList 
                    reviews={reviews}
                    onReviewSelect={handleReviewSelect}
                    selectedReview={selectedReview}
                    loading={loading}
                  />
                )}
              </div>

              {/* Review Detail */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Review Details
                </h2>
                {selectedReview ? (
                  <ReviewDetail 
                    review={selectedReview} 
                    onReviewUpdate={handleReviewUpdate}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a review to view details
                    </h3>
                    <p className="text-gray-500">
                      Choose a review from the list to see full details, categories, and management options.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}