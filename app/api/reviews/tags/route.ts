import { NextRequest, NextResponse } from 'next/server';
import { TagResponse } from '@/types/review';
import { PREDEFINED_TAGS } from '@/config/tags';

export async function GET(request: NextRequest) {
  try {
    // Use predefined tags from config
    const predefinedTags = PREDEFINED_TAGS;

    // Mock custom tags (in real app, fetch from database)
    const customTags = [
      { id: 'pet_friendly', name: 'pet_friendly', color: 'green', description: 'Pet-friendly accommodations' },
      { id: 'business_travel', name: 'business_travel', color: 'blue', description: 'Business travelers' },
      { id: 'family_friendly', name: 'family_friendly', color: 'purple', description: 'Family-friendly features' }
    ];

    const allTags = [...predefinedTags, ...customTags];

    return NextResponse.json({
      success: true,
      data: allTags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would add the tag to the database
    console.log(`Creating new tag: ${tag}`);

    // Create a new tag object
    const newTag = {
      id: `custom_${Date.now()}`, // Generate unique ID
      name: tag,
      color: 'blue', // Default color
      description: '' // Default empty description
    };

    return NextResponse.json({
      ok: true,
      tag: newTag,
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('id');
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would delete the tag from the database
    console.log(`Deleting tag with ID: ${tagId}`);

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

