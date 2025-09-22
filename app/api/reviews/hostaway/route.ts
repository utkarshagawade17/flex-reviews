import { NextRequest, NextResponse } from 'next/server';
import { fetchHostawayReviews } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const reviews = await fetchHostawayReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}