'use client';

import { useState } from 'react';
import { Star, MoreVertical, Copy, Check } from 'lucide-react';
import { NormalizedReview } from '@/types/review';
import TagChip from '@/components/ui/TagChip';

interface ReviewRowProps {
  review: NormalizedReview;
  selected: boolean;
  active: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
  density: 'comfortable' | 'compact';
}

export default function ReviewRow({
  review,
  selected,
  active,
  onSelect,
  onClick,
  density
}: ReviewRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSnippet = (text: string, maxLength: number = 160) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(`${review.source}:${review.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
    setShowMenu(false);
  };

  const handleClick = () => {
    console.log('ReviewRow: Clicked on review:', review);
    onClick();
  };

  const handleToggleApproved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/reviews/${review.source}/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !review.approved })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      
      // Optimistic update would be handled by React Query
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleToggleShowOnWeb = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/reviews/${review.source}/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedForWeb: !review.selectedForWeb })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const getChannelColor = (channel: string) => {
    const colors = {
      hostaway: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      google: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      airbnb: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      booking: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div
      className={`
        relative border rounded-lg transition-all duration-200 cursor-pointer group
        ${active 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${density === 'compact' ? 'p-3' : 'p-4'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(e.target.checked);
          }}
          className="mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
        />

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {review.guestName?.charAt(0) || '?'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {review.guestName || 'Anonymous'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChannelColor(review.channel)}`}>
                  {review.channel}
                </span>
                {review.type === 'host_to_guest' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Host Review
                  </span>
                )}
              </div>

              {/* Listing and Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="truncate">{review.listingName}</span>
                <span>•</span>
                <span>{formatDate(review.submittedAt)}</span>
              </div>

              {/* Rating */}
              {review.rating && (
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {review.rating}/5
                  </span>
                </div>
              )}

              {/* Text Snippet */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {getSnippet(review.text)}
              </p>

              {/* Tags */}
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {review.tags.slice(0, 3).map((tag) => (
                    <TagChip key={tag} tag={tag} size="sm" />
                  ))}
                  {review.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{review.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Toggles */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleToggleApproved}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    review.approved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  title={review.approved ? 'Approved' : 'Not approved'}
                >
                  ✓
                </button>
                <button
                  onClick={handleToggleShowOnWeb}
                  disabled={!review.approved}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    review.selectedForWeb
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  } ${!review.approved ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={review.selectedForWeb ? 'Shown on web' : 'Not shown on web'}
                >
                  🌐
                </button>
              </div>

              {/* Kebab Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
                    <button
                      onClick={handleCopyId}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
