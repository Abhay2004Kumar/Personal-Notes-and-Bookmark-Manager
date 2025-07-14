import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Note } from '@/models/note';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // Wait for params to resolve
  const { id } = await params;
  
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const payload = verifyToken(token || '');
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = payload.userId;
  const body = await req.json();

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // Wait for params to resolve
  const { id } = await params;
  
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const payload = verifyToken(token || '');
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = payload.userId;

  try {
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    console.error('Get note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // Wait for params to resolve
  const { id } = await params;
  
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const payload = verifyToken(token || '');
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = payload.userId;

  try {
    const deleted = await Note.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ 
      success: true, 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
