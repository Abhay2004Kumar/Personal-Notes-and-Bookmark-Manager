'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Bookmark } from '@/types';
import BookmarkCard from '@/components/BookmarkCard';
import CreateBookmarkDialog from '@/components/CreateBookmarkDialog';
import TagFilter from '@/components/TagFilter';
import { showSuccess, showError } from '@/lib/toast';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchBookmarks = useCallback(
    async (query = '') => {
      if (!token) return;
      
      try {
        const res = await axios.get('/api/bookmarks?' + query, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.data.success) {
          setBookmarks(res.data.data || []);
        } else {
          showError(res.data.error || 'Failed to fetch bookmarks');
        }
      } catch (error) {
        console.error('Fetch bookmarks error:', error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || 'Failed to fetch bookmarks'
          : 'An error occurred while fetching bookmarks';
        showError(errorMessage);
        
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/login');
        }
      }
    },
    [token, router, showError]
  );

  const deleteBookmark = async (id: string) => {
    if (!token) {
      showError('You need to be logged in to delete bookmarks');
      router.push('/login');
      return;
    }

    try {
      const res = await axios.delete(`/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        showSuccess('Bookmark deleted successfully');
        fetchBookmarks();
      } else {
        showError(res.data.error || 'Failed to delete bookmark');
      }
    } catch (error) {
      console.error('Delete bookmark error:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to delete bookmark'
        : 'An error occurred while deleting the bookmark';
      showError(errorMessage);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const toggleFavorite = async (bookmark: Bookmark) => {
    if (!token) {
      showError('You need to be logged in to update bookmarks');
      router.push('/login');
      return;
    }

    try {
      const res = await axios.put(
        `/api/bookmarks/${bookmark._id}`,
        { favorite: !bookmark.favorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const action = bookmark.favorite ? 'removed from' : 'added to';
        showSuccess(`Bookmark ${action} favorites`);
        fetchBookmarks();
      } else {
        showError(res.data.error || 'Failed to update favorite status');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to update favorite status'
        : 'An error occurred while updating favorite status';
      showError(errorMessage);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleFilter = (q: string, tags: string[]) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (tags.length > 0) params.append('tags', tags.join(','));
    fetchBookmarks(params.toString());
  };

  useEffect(() => {
    if (!token) router.push('/login');
    else fetchBookmarks();
  }, [token, router, fetchBookmarks]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🔖 My Bookmarks</h1>

      <CreateBookmarkDialog 
        onBookmarkCreated={() => {
          showSuccess('Bookmark created successfully');
          fetchBookmarks();
        }} 
      />
      <TagFilter onFilter={handleFilter} />

      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark}
            onEdit={fetchBookmarks}
            onDelete={() => deleteBookmark(bookmark._id)}
            onToggleFavorite={() => toggleFavorite(bookmark)}
          />
        ))}
      </div>
    </div>
  );
}
