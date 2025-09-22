'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface TrendsData {
  monthlyRatings: Array<{ month: string; averageRating: number; reviewCount: number }>;
  categoryBreakdown: Array<{ category: string; averageRating: number; count: number }>;
  channelMix: Array<{ channel: string; count: number; percentage: number }>;
}

export default function TrendsInsights() {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendsData();
  }, []);

  const fetchTrendsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/trends');
      const trendsData = await response.json();
      
      if (trendsData.success) {
        setData(trendsData.data);
      }
    } catch (error) {
      console.error('Error fetching trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No trends data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Ratings Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Average Rating by Month</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyRatings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), 'Average Rating']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="averageRating" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryBreakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), 'Average Rating']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="averageRating" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Mix */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Channel Mix</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.channelMix}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ channel, percentage }) => `${channel}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.channelMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Reviews']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

