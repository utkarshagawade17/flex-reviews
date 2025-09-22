import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { source: string; reviewId: string } }
) {
  try {
    const { source, reviewId } = params;
    const body = await request.json();
    const { tag } = body;

    console.log(`POST /api/reviews/${source}/${reviewId}/tags:`, { tag });

    // Validate inputs
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json(
        { error: 'tag is required and must be a string' },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the database
    // For now, we'll simulate adding the tag
    console.log(`Added tag "${tag}" to review ${reviewId} from ${source}`);

    return NextResponse.json({
      ok: true,
      tag,
      reviewId,
      source
    });

  } catch (error) {
    console.error('Error adding tag to review:', error);
    return NextResponse.json(
      { error: 'Failed to add tag to review' },
      { status: 500 }
    );
  }
}
