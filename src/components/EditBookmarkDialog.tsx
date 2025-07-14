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
import { Bookmark } from '@/types';
import { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '@/lib/toast';

interface BookmarkApiResponse {
  success: boolean;
  data?: {
    _id: string;
    url: string;
    title: string;
    description?: string;
    tags: string[];
    userId: string;
  };
  error?: string;
}

interface Props {
  bookmark: Bookmark;
  onUpdated: () => void;
}

export default function EditBookmarkDialog({ bookmark, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title || '');
  const [desc, setDesc] = useState(bookmark.description || '');
  const [tags, setTags] = useState(bookmark.tags?.join(', ') || '');

  const handleUpdate = async () => {
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
      showError('You must be logged in to edit bookmarks');
      return;
    }

    try {
      const response = await axios.put<BookmarkApiResponse>(
        `/api/bookmarks/${bookmark._id}`,
        {
          url: url.trim(),
          title: title.trim(),
          description: desc.trim(),
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess('Bookmark updated successfully');
        setOpen(false);
        onUpdated();
      } else {
        showError(response.data.error || 'Failed to update bookmark');
      }
    } catch (error: unknown) {
      console.error('Update bookmark error:', error);
      
      if (axios.isAxiosError<{ error?: string }>(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to update bookmark';
        showError(errorMessage);
        
        if (error.response?.status === 401) {
          // The parent component will handle the redirect
        }
      } else if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('An error occurred while updating the bookmark');
      }
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
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
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
