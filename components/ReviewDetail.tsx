'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Trash2, 
  Check, 
  X,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare
} from 'lucide-react';
import { NormalizedReview } from '@/types/review';
import { safeFormatDate } from '@/utils/date';
import { PREDEFINED_TAGS } from '@/config/tags';
import TagChip from './TagChip';
import TagSelector from './TagSelector';

interface ReviewDetailProps {
  review: NormalizedReview | null;
  onReviewUpdate: (reviewId: string, updates: Partial<NormalizedReview>) => void;
  onShowTrends?: () => void;
}

export default function ReviewDetail({ review, onReviewUpdate, onShowTrends }: ReviewDetailProps) {
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');

  if (!review) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
        <p>Select a review to view details</p>
        {onShowTrends && (
          <button
            onClick={onShowTrends}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Trends & Insights
          </button>
        )}
      </div>
    );
  }

  const handleApprove = () => {
    onReviewUpdate(review.id, { approved: !review.approved });
  };

  const handleFeature = () => {
    onReviewUpdate(review.id, { selectedForWeb: !review.selectedForWeb });
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // In a real implementation, this would send the reply to the API
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      // In a real implementation, this would add a note to the review
      console.log('Adding note:', noteText);
      setNoteText('');
    }
  };

  const handleTagsChange = (tags: string[]) => {
    onReviewUpdate(review.id, { tags });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'google':
        return <span className="text-blue-600 font-bold text-lg">G</span>;
      case 'airbnb':
        return <span className="text-pink-600 font-bold text-lg">A</span>;
      case 'booking':
        return <span className="text-blue-600 font-bold text-lg">B</span>;
      default:
        return <span className="text-gray-600 font-bold text-lg">H</span>;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default:
        return <ThumbsUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Navigation */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleApprove}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              review.approved
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800'
            }`}
          >
            {review.approved ? 'Approved' : 'Approve'}
          </button>
          <button
            onClick={handleFeature}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              review.selectedForWeb
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-800'
            }`}
          >
            {review.selectedForWeb ? 'Featured' : 'Feature'}
          </button>
        </div>
      </div>

      {/* Trends Button */}
      {onShowTrends && (
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={onShowTrends}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Trends & Insights
          </button>
        </div>
      )}

      {/* Review Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Review Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-lg">
              {review.guestName?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-lg font-semibold text-gray-900">{review.guestName || 'Anonymous'}</h2>
              <div className="flex items-center space-x-1">
                {getChannelIcon(review.channel)}
                <span className="text-sm text-gray-600">On {review.channel}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Review Text */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{review.text}</p>
        </div>

        {/* Rating and Categories */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">{review.rating || 0}/5</span>
          </div>

          {/* Category Ratings */}
          {Object.keys(review.categories).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Category Ratings:</h4>
              {Object.entries(review.categories).map(([category, rating]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (rating / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{rating}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Date */}
        <div className="text-sm text-gray-500 mb-6">
          {safeFormatDate(review.submittedAt, 'MMMM dd, yyyy')}
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
          <TagSelector
            selectedTags={review.tags || []}
            onTagsChange={handleTagsChange}
            availableTags={PREDEFINED_TAGS}
            placeholder="Add tags to this review..."
            className="max-w-md"
          />
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">AP</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Andy Patel added a note</p>
              <p className="text-xs text-gray-500">{safeFormatDate(new Date(), 'MMM dd, yyyy')}</p>
            </div>
            <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors">
              <Trash2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            This is a sample note about the review. In a real implementation, this would be fetched from the database.
          </p>
        </div>

        {/* Reply Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">HG</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Hanna Gover</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">
            This is a sample reply to the review. In a real implementation, this would be fetched from the database.
          </p>

          {/* Reply Input */}
          <div className="space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Start typing to reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                This reply will be public on {review.channel}
              </p>
              <button
                onClick={handleSendReply}
                className="btn-primary text-sm"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>

        {/* Add Note Section */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add Internal Note</h4>
          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a private note about this review..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
            />
            <button
              onClick={handleAddNote}
              className="btn-secondary text-sm"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
