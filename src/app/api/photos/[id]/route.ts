import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Query single photo by ID
    const photo = await db.select()
      .from(photos)
      .where(eq(photos.id, parseInt(id)))
      .limit(1);

    // Return 404 if photo not found
    if (photo.length === 0) {
      return NextResponse.json(
        { 
          error: 'Photo not found',
          code: 'PHOTO_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return photo object
    return NextResponse.json(photo[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if photo exists before deleting
    const existingPhoto = await db.select()
      .from(photos)
      .where(eq(photos.id, parseInt(id)))
      .limit(1);

    if (existingPhoto.length === 0) {
      return NextResponse.json(
        { 
          error: 'Photo not found',
          code: 'PHOTO_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete photo and return deleted record
    const deleted = await db.delete(photos)
      .where(eq(photos.id, parseInt(id)))
      .returning();

    // Return success message with deleted photo
    return NextResponse.json(
      {
        success: true,
        message: 'Photo deleted successfully',
        photo: deleted[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    );
  }
}