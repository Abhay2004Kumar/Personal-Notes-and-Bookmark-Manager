'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Note } from '@/types';
import { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '@/lib/toast';

interface Props {
  note: Note;
  onUpdated: () => void;
}

export default function EditNoteDialog({ note, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState(note.tags?.join(', ') || '');

  const handleUpdate = async () => {
    if (!title.trim()) {
      showError('Title is required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('You need to be logged in to update notes');
      return;
    }

    try {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await axios.put(
        `/api/notes/${note._id}`,
        {
          title,
          content,
          tags: tagArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        showSuccess('Note updated successfully');
        setOpen(false);
        onUpdated();
      } else {
        showError(res.data.error || 'Failed to update note');
      }
    } catch (err) {
      console.error('Update note error:', err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to update note'
        : 'An error occurred while updating the note';
      showError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags"
          />
          <Button className="w-full mt-2" onClick={handleUpdate}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
