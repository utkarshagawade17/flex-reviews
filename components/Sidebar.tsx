'use client';

import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  Calendar, 
  Share2,
  Filter,
  MapPin,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { DashboardStats, ReviewFilters } from '@/types/review';
import { PREDEFINED_TAGS } from '@/config/tags';
import TagChip from './TagChip';

interface SidebarProps {
  stats: DashboardStats;
  filters: ReviewFilters;
  onFilterChange: (filters: Partial<ReviewFilters>) => void;
}

export default function Sidebar({ stats, filters, onFilterChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    tags: true,
    ratings: false,
    source: false,
    sentiment: false,
    classification: false,
    location: false,
    timeWindow: false,
    sort: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { label: 'All', count: stats.totalReviews, status: undefined },
    { label: 'Need Response', count: stats.pendingReviews, status: 'pending' },
    { label: 'Featured', count: stats.featuredReviews, status: 'featured' },
    { label: 'Mine', count: stats.myReviews, status: 'mine' },
    { label: 'Assigned', count: stats.assignedReviews, status: 'assigned' },
    { label: 'Closed', count: stats.closedReviews, status: 'closed' },
    { label: 'Spam', count: stats.spamReviews, status: 'spam' },
  ];

  const tagOptions = PREDEFINED_TAGS;

  const ratingOptions = [5, 4, 3, 2, 1];
  const sourceOptions = ['Hostaway', 'Google', 'Airbnb', 'Booking.com'];
  const sentimentOptions = ['Positive', 'Neutral', 'Negative'];
  const classificationOptions = ['Cleanliness', 'Communication', 'Location', 'Value'];
  const locationOptions = ['New York, NY', 'London, UK', 'Manchester, UK'];

  const handleStatusFilter = (status: string | undefined) => {
    if (status === 'featured') {
      onFilterChange({ status: undefined, tags: ['featured'] });
    } else if (status === 'mine') {
      onFilterChange({ status: undefined, q: 'UG' });
    } else if (status === 'assigned') {
      onFilterChange({ status: 'pending' });
    } else if (status === 'closed') {
      onFilterChange({ status: 'rejected' });
    } else if (status === 'spam') {
      onFilterChange({ status: undefined, sentiment: 'negative' });
    } else {
      onFilterChange({ status });
    }
  };

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Reviews Dashboard</h1>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-gray-800 text-white px-10 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-primary-500"
            onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleStatusFilter(item.status)}
              className={`sidebar-item w-full text-left ${
                filters.status === item.status || 
                (item.status === 'featured' && filters.tags?.includes('featured')) ||
                (item.status === 'mine' && filters.q === 'UG') ||
                (item.status === 'assigned' && filters.status === 'pending') ||
                (item.status === 'closed' && filters.status === 'rejected') ||
                (item.status === 'spam' && filters.sentiment === 'negative')
                  ? 'active' : ''
              }`}
            >
              <span>{item.label}</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                {item.count}
              </span>
            </button>
          ))}
        </nav>

        {/* Filter Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filter by</h3>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Tags Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </span>
              {expandedSections.tags ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.tags && (
              <div className="space-y-2 ml-6">
                {tagOptions.map((tag) => (
                  <label key={tag.id} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 rounded"
                      checked={filters.tags?.includes(tag.id) || false}
                      onChange={(e) => {
                        const currentTags = filters.tags || [];
                        if (e.target.checked) {
                          onFilterChange({ tags: [...currentTags, tag.id] });
                        } else {
                          onFilterChange({ tags: currentTags.filter(t => t !== tag.id) });
                        }
                      }}
                    />
                    <span className="flex items-center gap-2">
                      <TagChip tag={tag.name} size="sm" />
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Ratings Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('ratings')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Ratings
              </span>
              {expandedSections.ratings ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.ratings && (
              <div className="space-y-2 ml-6">
                <label className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="rating"
                    className="mr-2"
                    checked={!filters.rating}
                    onChange={() => onFilterChange({ rating: undefined })}
                  />
                  <span className="text-gray-500">All Ratings</span>
                </label>
                {ratingOptions.map((rating) => (
                  <label key={rating} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="rating"
                      className="mr-2"
                      checked={filters.rating === rating}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFilterChange({ rating });
                        } else {
                          onFilterChange({ rating: undefined });
                        }
                      }}
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className="ml-1">({rating})</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Source Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('source')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Source
              </span>
              {expandedSections.source ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.source && (
              <div className="space-y-2 ml-6">
                {sourceOptions.map((source) => (
                  <label key={source} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFilterChange({ channel: source.toLowerCase() });
                        } else {
                          onFilterChange({ channel: undefined });
                        }
                      }}
                    />
                    {source}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sentiment Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('sentiment')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Sentiment
              </span>
              {expandedSections.sentiment ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.sentiment && (
              <div className="space-y-2 ml-6">
                {sentimentOptions.map((sentiment) => (
                  <label key={sentiment} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFilterChange({ sentiment: sentiment.toLowerCase() });
                        } else {
                          onFilterChange({ sentiment: undefined });
                        }
                      }}
                    />
                    {sentiment}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Classification Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('classification')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Classification
              </span>
              {expandedSections.classification ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.classification && (
              <div className="space-y-2 ml-6">
                {classificationOptions.map((classification) => (
                  <label key={classification} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 rounded"
                    />
                    {classification}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('location')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </span>
              {expandedSections.location ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.location && (
              <div className="space-y-2 ml-6">
                {locationOptions.map((location) => (
                  <label key={location} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFilterChange({ listing: location });
                        } else {
                          onFilterChange({ listing: undefined });
                        }
                      }}
                    />
                    {location}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Time Window Filter */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('timeWindow')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time Window
              </span>
              {expandedSections.timeWindow ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.timeWindow && (
              <div className="space-y-2 ml-6">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: '7', label: 'Last 7 days' },
                  { value: '30', label: 'Last 30 days' },
                  { value: '90', label: 'Last 90 days' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="timeWindow"
                      value={option.value}
                      className="mr-2"
                      onChange={(e) => onFilterChange({ timeWindow: e.target.value === 'all' ? undefined : e.target.value })}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort By
              </span>
              {expandedSections.sort ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.sort && (
              <div className="space-y-2 ml-6">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'highest_rating', label: 'Highest Rating' },
                  { value: 'lowest_rating', label: 'Lowest Rating' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      className="mr-2"
                      onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
