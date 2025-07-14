import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Bookmark } from '@/models/bookmark';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Check if the bookmark exists and belongs to the user
    const existingBookmark = await Bookmark.findOne({ _id: id, userId });
    if (!existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true, runValidators: true }
    );

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Failed to update bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark updated successfully',
      data: bookmark
    });
  } catch (error) {
    console.error('Update bookmark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();

    const authHeader = _.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const payload = verifyToken(token || '');
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = payload.userId;

    // Check if the bookmark exists and belongs to the user
    const existingBookmark = await Bookmark.findOne({ _id: id, userId });
    if (!existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    const deletedBookmark = await Bookmark.findOneAndDelete({ _id: id, userId });
    if (!deletedBookmark) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
