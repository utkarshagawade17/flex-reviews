import { NextRequest, NextResponse } from 'next/server';
import { fetchHostawayReviews, fetchGoogleReviews } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    // Fetch reviews from all sources
    const hostawayReviews = await fetchHostawayReviews();
    const googleReviews = await fetchGoogleReviews();
    let allReviews = [...hostawayReviews, ...googleReviews];

    // Filter by approved and selected for web
    let approvedReviews = allReviews.filter(review => 
      review.approved && review.selectedForWeb
    );

    // Filter by listing if specified
    if (listingId) {
      approvedReviews = approvedReviews.filter(review =>
        review.listingId === listingId ||
        review.listingName.toLowerCase().includes(listingId.toLowerCase())
      );
    }

    // Sort by date descending (newest first)
    approvedReviews.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({
      reviews: approvedReviews,
      total: approvedReviews.length
    });

  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approved reviews' },
      { status: 500 }
    );
  }
}