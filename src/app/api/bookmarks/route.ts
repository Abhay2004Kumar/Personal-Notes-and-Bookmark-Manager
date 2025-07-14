import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Bookmark } from '@/models/bookmark';
import { fetchBookmarkTitle } from '@/lib/fetchMetadata';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const payload = verifyToken(token || '');
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = payload.userId;
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const tags = searchParams.get('tags')?.split(',');

    const query: {
      userId: string;
      $or?: Array<{
        [key: string]: { $regex: string; $options: string };
      }>;
      tags?: { $in: string[] };
    } = { userId };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (tags && tags.length > 0 && tags[0] !== '') {
      query.tags = { $in: tags };
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const payload = verifyToken(token || '');
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const body = await req.json();
    const { url, title, description, tags } = body;

    if (!url || !/^https?:\/\/.+\..+/.test(url)) {
      return NextResponse.json(
        { success: false, error: 'A valid URL is required' },
        { status: 400 }
      );
    }

    // Check if bookmark already exists for this user
    const existingBookmark = await Bookmark.findOne({ url, userId });
    if (existingBookmark) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This URL is already bookmarked',
          data: existingBookmark
        },
        { status: 400 }
      );
    }

    // Fetch page title if user left it blank
    const finalTitle = title?.trim() || (await fetchBookmarkTitle(url)) || 'Untitled';

    const bookmark = await Bookmark.create({
      url,
      title: finalTitle,
      description,
      tags,
      userId,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Bookmark added successfully',
        data: bookmark 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create bookmark error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add bookmark. Please try again.' 
      },
      { status: 500 }
    );
  }
}
