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
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          {/* Content Block */}
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline break-words text-lg"
            >
              {bookmark.title || bookmark.url}
            </a>

            {bookmark.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 text-sm text-muted-foreground mt-1">
                {bookmark.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}

            {bookmark.description && (
              <p className="text-sm text-muted-foreground mt-1 break-words">
                {bookmark.description}
              </p>
            )}
          </div>

          {/* Actions Block */}
          <div className="flex sm:flex-col flex-row flex-wrap items-center justify-end gap-2">
            <Button
              size="icon"
              variant="ghost"
              title={bookmark.favorite ? 'Unmark Favorite' : 'Mark Favorite'}
              onClick={onToggleFavorite}
            >
              {bookmark.favorite ? (
                <Star className="text-yellow-500" />
              ) : (
                <StarOff />
              )}
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
