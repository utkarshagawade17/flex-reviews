import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, value } = body;

    console.log('Bulk show on web operation:', { items, value });

    // Validate inputs
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'items must be an array' },
        { status: 400 }
      );
    }

    if (typeof value !== 'boolean') {
      return NextResponse.json(
        { error: 'value must be a boolean' },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the database
    // For now, we'll simulate the bulk update
    const results = items.map((item: { source: string; reviewId: string }) => ({
      source: item.source,
      reviewId: item.reviewId,
      selectedForWeb: value,
      success: true
    }));

    console.log(`Bulk updated ${items.length} reviews for web display:`, results);

    return NextResponse.json({
      ok: true,
      results,
      processed: items.length
    });

  } catch (error) {
    console.error('Error in bulk show operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk show operation' },
      { status: 500 }
    );
  }
}
