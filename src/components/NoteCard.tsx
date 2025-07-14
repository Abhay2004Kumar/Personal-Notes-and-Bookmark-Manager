'use client';

import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EditNoteDialog from './EditNoteDialog';
import { Star, StarOff } from 'lucide-react';

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg">{note.title}</h2>
            {note.tags && note.tags.length > 0 && (
              <div className="text-sm text-muted-foreground space-x-2 mt-1">
                {note.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              title={note.favorite ? 'Unmark Favorite' : 'Mark Favorite'}
              onClick={onToggleFavorite}
            >
              {note.favorite ? <Star className="text-yellow-500" /> : <StarOff />}
            </Button>
            <EditNoteDialog note={note} onUpdated={onEdit} />
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>

        {note.content && <p className="text-sm text-muted-foreground">{note.content}</p>}
      </CardContent>
    </Card>
  );
}
