import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Validate token parameter
    if (!token || token.trim() === '') {
      return NextResponse.json(
        {
          error: 'Valid share token is required',
          code: 'INVALID_TOKEN',
        },
        { status: 400 }
      );
    }

    // Query database for photo with matching share token
    const photo = await db
      .select()
      .from(photos)
      .where(eq(photos.shareToken, token))
      .limit(1);

    // Check if photo was found
    if (photo.length === 0) {
      return NextResponse.json(
        {
          error: 'Photo not found',
          code: 'PHOTO_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return the photo object
    return NextResponse.json(photo[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}