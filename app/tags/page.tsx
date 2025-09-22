'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { ReviewTag } from '@/types/review';
import { PREDEFINED_TAGS } from '@/config/tags';
import TagChip from '@/components/TagChip';

export default function TagsPage() {
  const [tags, setTags] = useState<ReviewTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<ReviewTag | null>(null);
  const [newTag, setNewTag] = useState({ name: '', color: 'blue', description: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      console.log('Fetching tags from /api/reviews/tags...');
      const response = await fetch('/api/reviews/tags');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const text = await response.text();
      console.log('Raw response:', text);
      
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      
      if (data.success) {
        setTags(data.data);
        console.log('Tags set:', data.data);
      } else {
        console.error('API returned success: false', data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    try {
      console.log('Creating tag:', newTag.name);
      const response = await fetch('/api/reviews/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTag.name })
      });

      console.log('Create tag response status:', response.status);
      const text = await response.text();
      console.log('Create tag raw response:', text);
      
      const data = JSON.parse(text);
      console.log('Create tag parsed data:', data);
      
      if (data.ok) {
        // Add the new tag to the local state immediately
        const newTagObj = {
          id: data.tag.id,
          name: data.tag.name,
          color: newTag.color,
          description: newTag.description
        };
        console.log('Adding new tag to state:', newTagObj);
        setTags(prev => {
          const updated = [...prev, newTagObj];
          console.log('Updated tags state:', updated);
          return updated;
        });
        setNewTag({ name: '', color: 'blue', description: '' });
        setIsCreating(false);
      } else {
        alert('Error creating tag: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag');
    }
  };

  const handleUpdateTag = async (tag: ReviewTag) => {
    try {
      const response = await fetch('/api/reviews/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      });

      const data = await response.json();
      
      if (data.success) {
        setTags(prev => prev.map(t => t.id === tag.id ? data.data : t));
        setEditingTag(null);
      } else {
        alert('Error updating tag: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const response = await fetch(`/api/reviews/tags?id=${tagId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setTags(prev => prev.filter(t => t.id !== tagId));
      } else {
        alert('Error deleting tag: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag');
    }
  };

  const predefinedTags = tags.filter(tag => PREDEFINED_TAGS.some(pt => pt.id === tag.id));
  const customTags = tags.filter(tag => !PREDEFINED_TAGS.some(pt => pt.id === tag.id));

  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'purple', label: 'Purple' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'gold', label: 'Gold' },
    { value: 'red', label: 'Red' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'pink', label: 'Pink' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tag Management</h1>
          <p className="text-gray-600">Manage tags for categorizing and filtering reviews</p>
        </div>

        {/* Predefined Tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Predefined Tags</h2>
            <span className="text-sm text-gray-500">System tags (cannot be modified)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map(tag => (
              <TagChip key={tag.id} tag={tag.name} size="md" />
            ))}
          </div>
        </div>

        {/* Custom Tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Custom Tags</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>
          
          {customTags.length > 0 ? (
            <div className="space-y-3">
              {customTags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TagChip tag={tag.name} size="md" />
                    {tag.description && (
                      <span className="text-sm text-gray-500">{tag.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No custom tags yet. Create your first tag to get started.</p>
            </div>
          )}
        </div>

        {/* Create/Edit Tag Modal */}
        {(isCreating || editingTag) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={editingTag ? editingTag.name : newTag.name}
                    onChange={(e) => {
                      if (editingTag) {
                        setEditingTag({ ...editingTag, name: e.target.value });
                      } else {
                        setNewTag({ ...newTag, name: e.target.value });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter tag name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={editingTag ? editingTag.color : newTag.color}
                    onChange={(e) => {
                      if (editingTag) {
                        setEditingTag({ ...editingTag, color: e.target.value });
                      } else {
                        setNewTag({ ...newTag, color: e.target.value });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editingTag ? editingTag.description || '' : newTag.description}
                    onChange={(e) => {
                      if (editingTag) {
                        setEditingTag({ ...editingTag, description: e.target.value });
                      } else {
                        setNewTag({ ...newTag, description: e.target.value });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter tag description"
                    rows={3}
                  />
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview
                  </label>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <TagChip
                      tag={editingTag ? editingTag.name : newTag.name || 'Preview'}
                      size="md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTag(null);
                    setNewTag({ name: '', color: 'blue', description: '' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingTag) {
                      handleUpdateTag(editingTag);
                    } else {
                      handleCreateTag();
                    }
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
