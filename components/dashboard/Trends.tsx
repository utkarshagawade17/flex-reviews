'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendsData } from '@/types/review';
import { useTheme } from 'next-themes';

export default function Trends() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trends', '180d'],
    queryFn: async () => {
      console.log('Fetching trends data...');
      const response = await fetch('/api/reviews/trends?range=180d');
      if (!response.ok) {
        throw new Error('Failed to fetch trends');
      }
      const result = await response.json();
      console.log('Trends API response:', result);
      return result;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>Failed to load trends</p>
      </div>
    );
  }

  const { byMonth, byCategory, bySource } = data;

  // Debug logging
  console.log('Trends data received:', { byMonth, byCategory, bySource });

  // Prepare data for charts
  const monthlyData = byMonth?.filter((item: any) => item.count > 0) || []; // Only months with data
  const categoryData = byCategory?.slice(0, 5) || []; // Top 5 categories
  const sourceData = bySource || [];

  console.log('Processed chart data:', { monthlyData, categoryData, sourceData });
  console.log('Source data details:', sourceData);
  console.log('Source data length:', sourceData.length);
  console.log('Source data for pie chart:', sourceData.map((item: any) => ({ source: item.source, count: item.count })));
  console.log('Source data structure check:', sourceData.map((item: any) => ({ 
    hasSource: 'source' in item, 
    hasCount: 'count' in item, 
    source: item.source, 
    count: item.count 
  })));

  // Check if we have any data
  const hasData = monthlyData.length > 0 || categoryData.length > 0 || sourceData.length > 0;
  
  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Average Rating (Last 6 Months)
          </h3>
          <div className="h-24 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No data available</p>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Category Ratings
          </h3>
          <div className="h-24 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No data available</p>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Review Sources
          </h3>
          <div className="h-24 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h2>
        <button
          onClick={() => {
            console.log('Refresh button clicked');
            refetch();
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Average Rating by Month */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          Average Rating (Last 6 Months)
        </h3>
        <div className="h-36">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6"/>
                    <stop offset="50%" stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#EC4899"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickFormatter={(value) => value.split('-')[1]}
                  axisLine={{ stroke: '#D1D5DB' }}
                  tickLine={{ stroke: '#D1D5DB' }}
                />
                <YAxis 
                  domain={[0, 5]}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#D1D5DB' }}
                  tickLine={{ stroke: '#D1D5DB' }}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(1), 'Rating']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRating"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#ratingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gradient-to-br from-white/90 to-pink-50/90 dark:from-gray-800/90 dark:to-purple-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-200/50 dark:border-purple-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
          Category Ratings
        </h3>
        <div className="h-32">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" className="opacity-40" />
                <XAxis 
                  type="number" 
                  domain={[0, 10]}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#D1D5DB' }}
                  tickLine={{ stroke: '#D1D5DB' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#374151' }}
                  width={80}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(1), 'Rating']}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="avg" 
                  fill="url(#categoryGradient)"
                  radius={[0, 4, 4, 0]}
                />
                <defs>
                  <linearGradient id="categoryGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Source Distribution */}
      <div className="bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-gray-800/90 dark:to-indigo-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
          Review Sources
        </h3>
        <div className="h-40">
          {sourceData.length > 0 ? (
            <div className="space-y-4">
              {/* Visual Progress Bars */}
              <div className="space-y-3">
                {sourceData.map((entry: any, index: number) => {
                  const total = sourceData.reduce((sum: number, item: any) => sum + item.count, 0);
                  const percentage = (entry.count / total) * 100;
                  const colors = ['#3B82F6', '#EF4444'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={entry.source} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {entry.source}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.count} reviews ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                  Total Reviews
                </div>
                <div className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                  {sourceData.reduce((sum: number, item: any) => sum + item.count, 0)} reviews
                </div>
                <div className="text-xs text-indigo-500 dark:text-indigo-300">
                  from {sourceData.length} source{sourceData.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
