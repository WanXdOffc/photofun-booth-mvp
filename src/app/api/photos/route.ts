import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    let query = db.select().from(photos).orderBy(desc(photos.createdAt));

    if (userId) {
      query = query.where(eq(photos.userId, userId));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageUrl, shareToken, filters, overlays } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { 
          error: "userId is required",
          code: "MISSING_USER_ID"
        },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { 
          error: "imageUrl is required",
          code: "MISSING_IMAGE_URL"
        },
        { status: 400 }
      );
    }

    // Validate imageUrl is a valid string
    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { 
          error: "imageUrl must be a non-empty string",
          code: "INVALID_IMAGE_URL"
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid string
    if (typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { 
          error: "userId must be a non-empty string",
          code: "INVALID_USER_ID"
        },
        { status: 400 }
      );
    }

    // Generate shareToken if not provided
    const finalShareToken = shareToken || randomUUID();

    // Check if shareToken already exists (if provided)
    if (shareToken) {
      const existingPhoto = await db.select()
        .from(photos)
        .where(eq(photos.shareToken, shareToken))
        .limit(1);

      if (existingPhoto.length > 0) {
        return NextResponse.json(
          { 
            error: "shareToken already exists",
            code: "DUPLICATE_SHARE_TOKEN"
          },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData: {
      userId: string;
      imageUrl: string;
      shareToken: string;
      filters?: any;
      overlays?: any;
      createdAt: string;
    } = {
      userId: userId.trim(),
      imageUrl: imageUrl.trim(),
      shareToken: finalShareToken,
      createdAt: new Date().toISOString()
    };

    // Add optional fields if provided
    if (filters !== undefined) {
      insertData.filters = filters;
    }

    if (overlays !== undefined) {
      insertData.overlays = overlays;
    }

    // Insert into database
    const newPhoto = await db.insert(photos)
      .values(insertData)
      .returning();

    return NextResponse.json(newPhoto[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}