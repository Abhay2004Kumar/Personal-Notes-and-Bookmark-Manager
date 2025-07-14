'use client';

import { Bookmark } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EditBookmarkDialog from './EditBookmarkDialog';
import { Star, StarOff } from 'lucide-react';

interface Props {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export default function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline text-lg"
            >
              {bookmark.title || bookmark.url}
            </a>
            {bookmark.tags?.length > 0 && (
              <div className="text-sm text-muted-foreground space-x-2 mt-1">
                {bookmark.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
            {bookmark.description && (
              <p className="text-sm text-muted-foreground">{bookmark.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              title={bookmark.favorite ? 'Unmark Favorite' : 'Mark Favorite'}
              onClick={onToggleFavorite}
            >
              {bookmark.favorite ? <Star className="text-yellow-500" /> : <StarOff />}
            </Button>
            <EditBookmarkDialog bookmark={bookmark} onUpdated={onEdit} />
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
