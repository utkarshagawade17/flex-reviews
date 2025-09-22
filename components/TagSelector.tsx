'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { ReviewTag } from '@/types/review';
import { PREDEFINED_TAGS } from '@/config/tags';
import TagChip from './TagChip';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: ReviewTag[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags = PREDEFINED_TAGS,
  placeholder = 'Add tags...',
  maxTags,
  className = ''
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  const selectedTagObjects = availableTags.filter(tag => 
    selectedTags.includes(tag.id)
  );

  const handleAddTag = (tagId: string) => {
    if (maxTags && selectedTags.length >= maxTags) return;
    if (!selectedTags.includes(tagId)) {
      onTagsChange([...selectedTags, tagId]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = () => {
    if (newTagName.trim() && !availableTags.find(tag => tag.id === newTagName.toLowerCase())) {
      const newTag: ReviewTag = {
        id: newTagName.toLowerCase().replace(/\s+/g, '_'),
        name: newTagName.trim(),
        color: 'blue',
        description: 'Custom tag'
      };
      // In a real app, this would save to the backend
      console.log('Creating new tag:', newTag);
      handleAddTag(newTag.id);
      setNewTagName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length === 1) {
        handleAddTag(filteredTags[0].id);
      } else if (newTagName.trim()) {
        handleCreateTag();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTagObjects.map(tag => (
          <TagChip
            key={tag.id}
            tag={tag.name}
            onRemove={() => handleRemoveTag(tag.id)}
            removable
            size="sm"
          />
        ))}
        {(!maxTags || selectedTags.length < maxTags) && (
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add tag
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tag List */}
          <div className="p-2">
            {filteredTags.length > 0 ? (
              <div className="space-y-1">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{tag.name}</span>
                      {tag.description && (
                        <span className="text-xs text-gray-500">{tag.description}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No tags found for "{searchTerm}"
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No available tags
              </div>
            )}

            {/* Create New Tag */}
            {searchTerm && !availableTags.find(tag => tag.id === searchTerm.toLowerCase().replace(/\s+/g, '_')) && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <button
                  onClick={handleCreateTag}
                  className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create "{searchTerm}"
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
