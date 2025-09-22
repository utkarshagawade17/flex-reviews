import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { source: string; reviewId: string; tag: string } }
) {
  try {
    const { source, reviewId, tag } = params;

    console.log(`DELETE /api/reviews/${source}/${reviewId}/tags/${tag}`);

    // In a real implementation, this would update the database
    // For now, we'll simulate removing the tag
    console.log(`Removed tag "${tag}" from review ${reviewId} from ${source}`);

    return NextResponse.json({
      ok: true,
      tag,
      reviewId,
      source
    });

  } catch (error) {
    console.error('Error removing tag from review:', error);
    return NextResponse.json(
      { error: 'Failed to remove tag from review' },
      { status: 500 }
    );
  }
}
