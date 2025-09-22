import { NextRequest, NextResponse } from 'next/server';
import { ReviewApproval } from '@/types/review';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { source: string; reviewId: string } }
) {
  try {
    const { source, reviewId } = params;
    const body = await request.json();
    const { approved, selectedForWeb } = body;

    console.log(`PATCH /api/reviews/${source}/${reviewId}:`, { approved, selectedForWeb });

    // Validate inputs
    if (typeof approved !== 'boolean' && approved !== undefined) {
      return NextResponse.json(
        { error: 'approved must be a boolean' },
        { status: 400 }
      );
    }

    if (typeof selectedForWeb !== 'boolean' && selectedForWeb !== undefined) {
      return NextResponse.json(
        { error: 'selectedForWeb must be a boolean' },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the database
    // For now, we'll simulate the update
    const approval: ReviewApproval = {
      source,
      reviewId,
      approved: approved ?? false,
      selectedForWeb: selectedForWeb ?? false,
    };

    // Simulate database update
    console.log('Updating review approval:', approval);

    return NextResponse.json({
      ok: true,
      approval,
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

