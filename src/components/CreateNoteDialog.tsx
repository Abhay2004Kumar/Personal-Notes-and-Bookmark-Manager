'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '@/lib/toast';

interface Props {
  onNoteCreated: () => void;
}

export default function CreateNoteDialog({ onNoteCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      showError('Title is required');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      showError('You must be logged in to create notes');
      return;
    }
  
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await axios.post(
        '/api/notes',
        {
          title,
          content,
          tags: tagArray
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      if (res.data.success) {
        showSuccess('Note created successfully');
        setTitle('');
        setContent('');
        setTags('');
        setOpen(false);
        onNoteCreated();
      } else {
        showError(res.data.error || 'Failed to create note');
      }
    } catch (err: any) {
      console.error('Failed to create note:', err);
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to create note'
        : 'An error occurred while creating the note';
      showError(errorMessage);
      alert('Failed to create note. Check console for details.');
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ New Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button className="w-full mt-2" onClick={handleSubmit}>
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
