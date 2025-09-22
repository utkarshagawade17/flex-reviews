import { ReviewTag } from '@/types/review';

export const PREDEFINED_TAGS: ReviewTag[] = [
  {
    id: 'wifi',
    name: 'WiFi',
    color: 'blue',
    description: 'Issues or mentions related to internet connectivity'
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    color: 'green',
    description: 'Cleanliness-related feedback'
  },
  {
    id: 'noise',
    name: 'Noise',
    color: 'orange',
    description: 'Noise complaints or mentions'
  },
  {
    id: 'location',
    name: 'Location',
    color: 'purple',
    description: 'Location-related feedback'
  },
  {
    id: 'host_response',
    name: 'Host Response',
    color: 'cyan',
    description: 'Host communication and responsiveness'
  },
  {
    id: 'long_stay',
    name: 'Long Stay',
    color: 'indigo',
    description: 'Extended stay reviews'
  },
  {
    id: 'vip',
    name: 'VIP',
    color: 'gold',
    description: 'High-priority or VIP guest reviews'
  },
  {
    id: 'spam',
    name: 'Spam',
    color: 'red',
    description: 'Suspected spam or fake reviews'
  },
  {
    id: 'todo',
    name: 'Todo',
    color: 'yellow',
    description: 'Requires follow-up action'
  },
  {
    id: 'featured',
    name: 'Featured',
    color: 'pink',
    description: 'Featured reviews for public display'
  }
];

export const TAG_COLORS = {
  blue: 'bg-gray-800 text-white border-white',
  green: 'bg-gray-800 text-white border-white',
  orange: 'bg-gray-800 text-white border-white',
  purple: 'bg-gray-800 text-white border-white',
  cyan: 'bg-gray-800 text-white border-white',
  indigo: 'bg-gray-800 text-white border-white',
  gold: 'bg-gray-800 text-white border-white',
  red: 'bg-gray-800 text-white border-white',
  yellow: 'bg-gray-800 text-white border-white',
  pink: 'bg-gray-800 text-white border-white'
} as const;

export function getTagColorClass(tag: ReviewTag): string {
  return TAG_COLORS[tag.color as keyof typeof TAG_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
}
