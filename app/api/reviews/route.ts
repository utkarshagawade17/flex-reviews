import { NextRequest, NextResponse } from 'next/server';
import { fetchHostawayReviews, fetchGoogleReviews } from '@/lib/api-utils';
import { NormalizedReview } from '@/types/review';

interface ReviewQueryParams {
  q?: string; // Search query
  source?: string; // Comma-separated sources: hostaway,google
  listingId?: string; // Specific listing ID
  tags?: string; // Comma-separated tags: wifi,cleanliness
  type?: string; // Comma-separated types: host_to_guest,guest_to_host
  ratingMin?: string; // Minimum rating (1-5)
  ratingMax?: string; // Maximum rating (1-5)
  sort?: string; // newest,oldest,rating_desc,rating_asc
  limit?: string; // Number of results (default 50, max 100)
  cursor?: string; // Pagination cursor
}

interface ReviewResponse {
  count: number;
  cursor?: string;
  reviews: NormalizedReview[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: ReviewQueryParams = {
      q: searchParams.get('q') || undefined,
      source: searchParams.get('source') || 'hostaway,google',
      listingId: searchParams.get('listingId') || undefined,
      tags: searchParams.get('tags') || undefined,
      type: searchParams.get('type') || undefined,
      ratingMin: searchParams.get('ratingMin') || undefined,
      ratingMax: searchParams.get('ratingMax') || undefined,
      sort: searchParams.get('sort') || 'newest',
      limit: searchParams.get('limit') || '50',
      cursor: searchParams.get('cursor') || undefined,
    };

    console.log('Canonical reviews API called with params:', params);

    // Fetch reviews from all sources
    const allReviews: NormalizedReview[] = [];
    
    // Add Hostaway reviews if requested
    if (params.source?.includes('hostaway')) {
      const hostawayReviews = await fetchHostawayReviews();
      allReviews.push(...hostawayReviews);
    }
    
    // Add Google reviews if requested
    if (params.source?.includes('google')) {
      const googleReviews = await fetchGoogleReviews();
      allReviews.push(...googleReviews);
    }

    console.log(`Fetched ${allReviews.length} total reviews from sources: ${params.source}`);

    // Apply filters
    let filteredReviews = allReviews;

    // Search query filter
    if (params.q) {
      const searchLower = params.q.toLowerCase();
      filteredReviews = filteredReviews.filter(review =>
        review.guestName?.toLowerCase().includes(searchLower) ||
        review.text.toLowerCase().includes(searchLower) ||
        review.listingName.toLowerCase().includes(searchLower)
      );
      console.log(`After search filter "${params.q}": ${filteredReviews.length} reviews`);
    }

    // Listing ID filter
    if (params.listingId) {
      filteredReviews = filteredReviews.filter(review =>
        review.listingName.toLowerCase().includes(params.listingId!.toLowerCase()) ||
        review.id.toString() === params.listingId
      );
      console.log(`After listing filter "${params.listingId}": ${filteredReviews.length} reviews`);
    }

    // Tags filter
    if (params.tags) {
      const tagList = params.tags.split(',').map(tag => tag.trim());
      filteredReviews = filteredReviews.filter(review =>
        tagList.some(tag => review.tags.includes(tag))
      );
      console.log(`After tags filter "${params.tags}": ${filteredReviews.length} reviews`);
    }

    // Type filter (review type)
    if (params.type) {
      const typeList = params.type.split(',').map(type => type.trim());
      filteredReviews = filteredReviews.filter(review =>
        typeList.includes(review.type)
      );
      console.log(`After type filter "${params.type}": ${filteredReviews.length} reviews`);
    }

    // Rating range filter
    if (params.ratingMin) {
      const minRating = parseInt(params.ratingMin);
      filteredReviews = filteredReviews.filter(review => (review.rating || 0) >= minRating);
      console.log(`After ratingMin filter ${minRating}: ${filteredReviews.length} reviews`);
    }

    if (params.ratingMax) {
      const maxRating = parseInt(params.ratingMax);
      filteredReviews = filteredReviews.filter(review => (review.rating || 0) <= maxRating);
      console.log(`After ratingMax filter ${maxRating}: ${filteredReviews.length} reviews`);
    }

    // Sort reviews
    const sortBy = params.sort || 'newest';
    filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating_asc':
          return (a.rating || 0) - (b.rating || 0);
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

    console.log(`After sorting by ${sortBy}: ${filteredReviews.length} reviews`);

    // Pagination
    const limit = Math.min(parseInt(params.limit || '50'), 100);
    const startIndex = params.cursor ? parseInt(params.cursor) : 0;
    const endIndex = startIndex + limit;
    
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredReviews.length;
    const nextCursor = hasMore ? endIndex.toString() : undefined;

    console.log(`Pagination: showing ${paginatedReviews.length} of ${filteredReviews.length} reviews (cursor: ${startIndex})`);

    const response: ReviewResponse = {
      count: filteredReviews.length,
      cursor: nextCursor,
      reviews: paginatedReviews,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('Error in canonical reviews API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
