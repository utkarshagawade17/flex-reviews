'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface TagInputProps {
  availableTags: string[];
  onAddTag: (tag: string) => void;
  onCancel: () => void;
}

export default function TagInput({ availableTags, onAddTag, onCancel }: TagInputProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setShowSuggestions(query.length > 0 && filteredTags.length > 0);
  }, [query, filteredTags.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredTags.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredTags.length) {
        handleAddTag(filteredTags[selectedIndex]);
      } else if (query.trim()) {
        handleAddTag(query.trim());
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim()) {
      onAddTag(tag.trim());
      setQuery('');
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    handleAddTag(tag);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0 && filteredTags.length > 0)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholder="Type to search tags..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
        <button
          onClick={() => handleAddTag(query)}
          disabled={!query.trim()}
          className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          title="Add tag"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
        >
          {filteredTags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => handleSuggestionClick(tag)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                index === selectedIndex ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
            >
              <span className="capitalize">{tag.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

