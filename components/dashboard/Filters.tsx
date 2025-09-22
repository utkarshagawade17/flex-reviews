'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { FilterState } from '@/types/dashboard';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export default function Filters({ filters, onFilterChange, onClearFilters }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || '');
  const [availableTags, setAvailableTags] = useState<{ predefined: string[]; custom: string[] }>({
    predefined: [],
    custom: []
  });

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/reviews/tags');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Convert the new API format to the expected format
          const predefined = data.data.filter((tag: any) => 
            ['wifi', 'cleanliness', 'noise', 'location', 'host_response', 'long_stay', 'vip', 'spam', 'todo', 'featured'].includes(tag.id)
          ).map((tag: any) => tag.name);
          
          const custom = data.data.filter((tag: any) => 
            !['wifi', 'cleanliness', 'noise', 'location', 'host_response', 'long_stay', 'vip', 'spam', 'todo', 'featured'].includes(tag.id)
          ).map((tag: any) => tag.name);
          
          setAvailableTags({ predefined, custom });
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ q: searchQuery || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onFilterChange]);

  const handleSourceChange = (source: string, checked: boolean) => {
    const currentSources = filters.source || [];
    if (checked) {
      onFilterChange({ source: [...currentSources, source] });
    } else {
      onFilterChange({ source: currentSources.filter(s => s !== source) });
    }
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || [];
    if (checked) {
      onFilterChange({ tags: [...currentTags, tag] });
    } else {
      onFilterChange({ tags: currentTags.filter(t => t !== tag) });
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.type || [];
    if (checked) {
      onFilterChange({ type: [...currentTypes, type] });
    } else {
      onFilterChange({ type: currentTypes.filter(t => t !== type) });
    }
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ratingMin: rating });
  };

  const handleSortChange = (sort: string) => {
    onFilterChange({ sort });
  };

  const allTags = [...availableTags.predefined, ...availableTags.custom];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Source Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Source
        </label>
        <div className="space-y-2">
          {['hostaway', 'google', 'airbnb', 'booking'].map((source) => (
            <label key={source} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.source?.includes(source) || false}
                onChange={(e) => handleSourceChange(source, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                {source}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Review Type
        </label>
        <div className="space-y-2">
          {[
            { value: 'guest_to_host', label: 'Guest to Host' },
            { value: 'host_to_guest', label: 'Host to Guest' }
          ].map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.type?.includes(type.value) || false}
                onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.ratingMin === rating
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < rating ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2">{rating}+ stars</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags?.includes(tag) || false}
                onChange={(e) => handleTagChange(tag, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort by
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rating_desc">Highest rating</option>
          <option value="rating_asc">Lowest rating</option>
        </select>
      </div>
    </div>
  );
}
