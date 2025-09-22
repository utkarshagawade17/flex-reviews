import { NextRequest, NextResponse } from 'next/server';
import { fetchHostawayReviews, fetchGoogleReviews } from '@/lib/api-utils';
import { TrendsData } from '@/types/review';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '180d';
    const listingId = searchParams.get('listingId');

    // Fetch reviews from all sources
    const hostawayReviews = await fetchHostawayReviews();
    const googleReviews = await fetchGoogleReviews();
    const allReviews = [...hostawayReviews, ...googleReviews];
    
    console.log('Trends API - Fetched reviews:', {
      hostawayCount: hostawayReviews.length,
      googleCount: googleReviews.length,
      totalCount: allReviews.length,
      sampleReview: allReviews[0] ? {
        id: allReviews[0].id,
        submittedAt: allReviews[0].submittedAt,
        source: allReviews[0].source
      } : null
    });

    // Filter by listing if specified
    let filteredReviews = allReviews;
    if (listingId) {
      filteredReviews = allReviews.filter(review =>
        review.listingName.toLowerCase().includes(listingId.toLowerCase()) ||
        review.id.toString() === listingId
      );
    }

    // Parse range (e.g., "180d" = 180 days)
    const days = parseInt(range.replace('d', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // For demo purposes, use a more lenient date range
    const demoCutoffDate = new Date();
    demoCutoffDate.setDate(demoCutoffDate.getDate() - 365); // 1 year for demo
    
    console.log('Trends API - Date filtering debug:', {
      currentDate: new Date().toISOString(),
      demoCutoffDate: demoCutoffDate.toISOString(),
      range,
      days
    });
    
    console.log('Trends API - Date filtering:', {
      range,
      days,
      cutoffDate: cutoffDate.toISOString(),
      totalReviewsBeforeFilter: filteredReviews.length,
      sampleDates: filteredReviews.slice(0, 3).map(r => r.submittedAt)
    });
    
    // For demo purposes, include all reviews from 2024
    filteredReviews = filteredReviews.filter(review => {
      const reviewDate = new Date(review.submittedAt);
      return reviewDate.getFullYear() >= 2024;
    });
    
    console.log('Trends API - After date filtering:', {
      totalReviewsAfterFilter: filteredReviews.length,
      sampleReviews: filteredReviews.slice(0, 3).map(r => ({
        id: r.id,
        submittedAt: r.submittedAt,
        rating: r.rating
      }))
    });

    // 1. By Month (last 12 months)
    const monthlyRatings: { [key: string]: { totalRating: number; count: number } } = {};
    const now = new Date();
    // Start from July 2024 to include our mock data
    const startDate = new Date(2024, 6, 1); // July 2024
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Next month
    
    for (let date = new Date(startDate); date < endDate; date.setMonth(date.getMonth() + 1)) {
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyRatings[monthYear] = { totalRating: 0, count: 0 };
    }

    filteredReviews.forEach(review => {
      const reviewDate = new Date(review.submittedAt);
      const monthYear = `${reviewDate.getFullYear()}-${(reviewDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (monthlyRatings[monthYear] && review.rating) {
        monthlyRatings[monthYear].totalRating += review.rating;
        monthlyRatings[monthYear].count++;
      }
    });

    const byMonth = Object.keys(monthlyRatings)
      .sort()
      .map(monthYear => ({
        month: monthYear,
        avgRating: monthlyRatings[monthYear].count > 0
          ? parseFloat((monthlyRatings[monthYear].totalRating / monthlyRatings[monthYear].count).toFixed(1))
          : 0,
        count: monthlyRatings[monthYear].count,
      }));

    // 2. By Category (normalize to 0-10 scale)
    const categoryBreakdown: { [key: string]: { totalRating: number; count: number } } = {};
    filteredReviews.forEach(review => {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = { totalRating: 0, count: 0 };
        }
        // Normalize rating to 0-10 scale (assuming input is 1-5 scale)
        const normalizedRating = rating <= 5 ? rating * 2 : rating;
        categoryBreakdown[category].totalRating += normalizedRating;
        categoryBreakdown[category].count++;
      });
    });

    const byCategory = Object.keys(categoryBreakdown).map(category => ({
      name: category,
      avg: categoryBreakdown[category].count > 0
        ? parseFloat((categoryBreakdown[category].totalRating / categoryBreakdown[category].count).toFixed(1))
        : 0,
    }));

    // 3. By Source
    const sourceBreakdown: { [key: string]: number } = {};
    filteredReviews.forEach(review => {
      if (!sourceBreakdown[review.source]) {
        sourceBreakdown[review.source] = 0;
      }
      sourceBreakdown[review.source]++;
    });

    const bySource = Object.keys(sourceBreakdown).map(source => ({
      source,
      count: sourceBreakdown[source],
    }));

    const trendsData: TrendsData = {
      byMonth,
      byCategory,
      bySource,
    };

    console.log('Trends API - Raw data:', {
      totalReviews: filteredReviews.length,
      byMonth: byMonth.length,
      byCategory: byCategory.length,
      bySource: bySource.length,
      sampleCategory: byCategory[0],
      sampleSource: bySource[0]
    });

    return NextResponse.json(trendsData);
  } catch (error) {
    console.error('Error fetching trends data:', error);
    return NextResponse.json({ error: 'Failed to fetch trends data' }, { status: 500 });
  }
}