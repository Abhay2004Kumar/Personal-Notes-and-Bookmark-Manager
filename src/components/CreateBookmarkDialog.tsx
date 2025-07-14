'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import axios from 'axios';
import { showError } from '@/lib/toast';

interface Props {
  onBookmarkCreated: () => void;
}

export default function CreateBookmarkDialog({ onBookmarkCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async () => {
    if (!url.trim()) {
      showError('URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      showError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('You must be logged in to create bookmarks');
      return;
    }

    try {
      const response = await axios.post(
        '/api/bookmarks',
        {
          url,
          title: title.trim(),
          description: desc.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOpen(false);
        onBookmarkCreated();
        setUrl('');
        setTitle('');
        setDesc('');
        setTags('');
      } else {
        showError(response.data.error || 'Failed to create bookmark');
      }
    } catch (error) {
      console.error('Create bookmark error:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to create bookmark'
        : 'An error occurred while creating the bookmark';
      showError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ New Bookmark</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bookmark</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <Button className="w-full mt-2" onClick={handleSubmit}>
            Save Bookmark
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
