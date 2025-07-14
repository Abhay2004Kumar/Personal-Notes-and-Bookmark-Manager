'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Note } from '@/types';
import NoteCard from '@/components/NoteCard';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import TagFilter from '@/components/TagFilter';
import { showError, showSuccess } from '@/lib/toast';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  const fetchNotes = async (query = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.get('/api/notes?' + query, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setNotes(res.data.data);
      } else {
        showError(res.data.error || 'Failed to fetch notes');
      }
    } catch (err) {
      console.error('Fetch notes error:', err);
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to fetch notes'
        : 'An error occurred while fetching notes';
      showError(errorMessage);
      
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const deleteNote = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('You need to be logged in to delete notes');
      router.push('/login');
      return;
    }

    try {
      const res = await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        fetchNotes();
      } else {
        showError(res.data.error || 'Failed to delete note');
      }
    } catch (err) {
      console.error('Delete note error:', err);
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to delete note'
        : 'An error occurred while deleting the note';
      showError(errorMessage);
      
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleFavoriteToggle = async (note: Note) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('You need to be logged in to update notes');
      router.push('/login');
      return;
    }

    try {
      const res = await axios.put(
        `/api/notes/${note._id}`,
        { favorite: !note.favorite },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      
      if (res.data.success) {
        const action = note.favorite ? 'removed from' : 'added to';
        showSuccess(`Note ${action} favorites`);
        fetchNotes();
      } else {
        showError(res.data.error || 'Failed to update favorite status');
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to update favorite status'
        : 'An error occurred while updating favorite status';
      showError(errorMessage);
      
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleFilter = (q: string, tags: string[]) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (tags.length > 0) params.append('tags', tags.join(','));
    fetchNotes(params.toString());
  };

  const handleNoteCreated = () => {
    showSuccess('Note created successfully');
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📒 My Notes</h1>

      <CreateNoteDialog onNoteCreated={handleNoteCreated} />
      <TagFilter onFilter={handleFilter} />

      <div className="grid gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={() => deleteNote(note._id)}
            onEdit={fetchNotes}
            onToggleFavorite={() => handleFavoriteToggle(note)}
          />
        ))}
      </div>
    </div>
  );
}
