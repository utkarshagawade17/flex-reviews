import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const reviews = await fetchGoogleReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}