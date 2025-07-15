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
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 sm:p-4 space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
          <div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline text-base sm:text-lg truncate max-w-full"
            >
              {bookmark.title || bookmark.url}
            </a>
            {bookmark.tags?.length > 0 && (
              <div className="text-sm text-muted-foreground space-x-1 sm:space-x-2 mt-1 flex-wrap">
                {bookmark.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
            {bookmark.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{bookmark.description}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <Button
              size="icon"
              variant="ghost"
              title={bookmark.favorite ? 'Unmark Favorite' : 'Mark Favorite'}
              onClick={onToggleFavorite}
            >
              {bookmark.favorite ? <Star className="text-yellow-500" /> : <StarOff />}
            </Button>
            <EditBookmarkDialog bookmark={bookmark} onUpdated={onEdit} />
            <Button size="sm" variant="destructive" onClick={onDelete} className="w-full sm:w-auto">
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
