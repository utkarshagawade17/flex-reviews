'use client';

import { useState, useEffect } from 'react';
import { Star, Copy, Check, Plus, X } from 'lucide-react';
import { NormalizedReview } from '@/types/review';
import TagChip from '@/components/ui/TagChip';
import TagInput from '@/components/ui/TagInput';

interface DetailPanelProps {
  review: NormalizedReview | null;
  onReviewUpdate: (reviewId: string, updates: Partial<NormalizedReview>) => void;
}

export default function DetailPanel({ review, onReviewUpdate }: DetailPanelProps) {
  const [availableTags, setAvailableTags] = useState<{ predefined: string[]; custom: string[] }>({
    predefined: [],
    custom: []
  });
  const [showTagInput, setShowTagInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localReview, setLocalReview] = useState<NormalizedReview | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('DetailPanel received review:', review);
    if (review) {
      console.log('DetailPanel: Review data is valid, rendering details');
    } else {
      console.log('DetailPanel: No review data, showing placeholder');
    }
  }, [review]);

  // Sync local review state with prop
  useEffect(() => {
    setLocalReview(review);
  }, [review]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleApproved = async () => {
    if (!review) return;
    
    try {
      const response = await fetch(`/api/reviews/${review.source}/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !review.approved })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      
      // Update local state immediately
      setLocalReview(prev => prev ? { ...prev, approved: !prev.approved } : null);
      
      onReviewUpdate(`${review.source}:${review.id}`, { approved: !review.approved });
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleToggleShowOnWeb = async () => {
    if (!localReview) return;
    
    try {
      const response = await fetch(`/api/reviews/${localReview.source}/${localReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedForWeb: !localReview.selectedForWeb })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      
      // Update local state immediately
      setLocalReview(prev => prev ? { ...prev, selectedForWeb: !prev.selectedForWeb } : null);
      
      onReviewUpdate(`${localReview.source}:${localReview.id}`, { selectedForWeb: !localReview.selectedForWeb });
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleFeature = async () => {
    if (!localReview) return;
    
    const isCurrentlyFeatured = localReview.tags.includes('featured');
    
    try {
      if (isCurrentlyFeatured) {
        // Remove featured tag
        const response = await fetch(`/api/reviews/${localReview.source}/${localReview.id}/tags/featured`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove featured tag');
        }
        
        // Update local state immediately
        setLocalReview(prev => prev ? { 
          ...prev, 
          tags: prev.tags.filter(tag => tag !== 'featured')
        } : null);
        
        onReviewUpdate(`${localReview.source}:${localReview.id}`, { 
          tags: localReview.tags.filter(tag => tag !== 'featured')
        });
      } else {
        // First approve and show on web
        const response1 = await fetch(`/api/reviews/${localReview.source}/${localReview.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            approved: true, 
            selectedForWeb: true 
          })
        });
        
        if (!response1.ok) {
          throw new Error('Failed to update review');
        }

        // Then add featured tag
        const response2 = await fetch(`/api/reviews/${localReview.source}/${localReview.id}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag: 'featured' })
        });
        
        if (!response2.ok) {
          throw new Error('Failed to add featured tag');
        }
        
        // Update local state immediately
        setLocalReview(prev => prev ? { 
          ...prev, 
          approved: true, 
          selectedForWeb: true,
          tags: [...prev.tags, 'featured']
        } : null);
        
        onReviewUpdate(`${localReview.source}:${localReview.id}`, { 
          approved: true, 
          selectedForWeb: true,
          tags: [...localReview.tags, 'featured']
        });
      }
    } catch (error) {
      console.error('Error featuring review:', error);
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!review) return;
    
    try {
      const response = await fetch(`/api/reviews/${review.source}/${review.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      
      onReviewUpdate(`${review.source}:${review.id}`, { 
        tags: [...review.tags, tag]
      });
      setShowTagInput(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!review) return;
    
    try {
      const response = await fetch(`/api/reviews/${review.source}/${review.id}/tags/${tag}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove tag');
      }
      
      onReviewUpdate(`${review.source}:${review.id}`, { 
        tags: review.tags.filter(t => t !== tag)
      });
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const handleCopyId = async () => {
    if (!review) return;
    
    try {
      await navigator.clipboard.writeText(`${review.source}:${review.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
  };

  if (!localReview) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>Select a review to view details</p>
      </div>
    );
  }

  const allTags = [...availableTags.predefined, ...availableTags.custom];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {localReview.guestName || 'Anonymous'}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              localReview.channel === 'hostaway' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              localReview.channel === 'google' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {localReview.channel}
            </span>
            {localReview.approved && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Approved
              </span>
            )}
            {localReview.selectedForWeb && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Featured
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopyId}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Copy Review ID"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Rating */}
      {localReview.rating && (
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < localReview.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {localReview.rating}/5
          </span>
        </div>
      )}

      {/* Date and Location */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>{formatDate(localReview.submittedAt)}</p>
        <p>{localReview.listingName}</p>
      </div>

      {/* Review Text */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Review
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {localReview.text}
        </p>
      </div>

      {/* Categories */}
      {Object.keys(localReview.categories).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Category Ratings
          </h4>
          <div className="space-y-2">
            {Object.entries(localReview.categories).map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(rating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {rating}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Tags
          </h4>
          <button
            onClick={() => setShowTagInput(!showTagInput)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Add tag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {showTagInput && (
          <div className="mb-3">
            <TagInput
              availableTags={allTags}
              onAddTag={handleAddTag}
              onCancel={() => setShowTagInput(false)}
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {localReview.tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              onRemove={() => handleRemoveTag(tag)}
              removable
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleToggleApproved}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            localReview.approved
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {localReview.approved ? 'Approved' : 'Approve'}
        </button>
        
        <button
          onClick={handleToggleShowOnWeb}
          disabled={!localReview.approved}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            localReview.selectedForWeb
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
          } ${!localReview.approved ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {localReview.selectedForWeb ? 'Shown on Web' : 'Show on Web'}
        </button>
        
        <button
          onClick={handleFeature}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Feature Review
        </button>
      </div>
    </div>
  );
}
