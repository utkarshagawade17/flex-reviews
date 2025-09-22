'use client';

import { X } from 'lucide-react';

interface TagChipProps {
  tag: string;
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
}

export default function TagChip({ tag, size = 'md', removable = false, onRemove }: TagChipProps) {
  const getTagColor = (tag: string) => {
    const colors = {
      wifi: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      cleanliness: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      noise: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      location: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      host_response: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      featured: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      vip: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      spam: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      todo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      long_stay: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    };
    
    return colors[tag as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getTagColor(tag)} ${sizeClasses[size]}`}>
      <span className="capitalize">{tag.replace('_', ' ')}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

