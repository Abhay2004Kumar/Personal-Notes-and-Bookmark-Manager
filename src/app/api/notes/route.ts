export const runtime = 'nodejs'; // ✅ Must be first line

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Note } from '@/models/note';
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
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    if (tags && tags.length > 0 && tags[0] !== '') {
      query.tags = { $in: tags };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
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
    const { title, content, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId,
    });

    await note.save();

    return NextResponse.json({
      success: true,
      message: 'Note created successfully',
      data: note
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
