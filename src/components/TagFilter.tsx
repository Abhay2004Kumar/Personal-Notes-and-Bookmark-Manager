'use client';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';

interface Props {
  onFilter: (q: string, tags: string[]) => void;
}

export default function TagFilter({ onFilter }: Props) {
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleFilter = () => {
    const tagList = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onFilter(search, tagList);
  };

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
      <Input
        placeholder="🔍 Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-background text-foreground border-muted placeholder:text-muted-foreground focus:ring-ring"
      />
      <Input
        placeholder="🏷️ Tags (comma separated)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        className="bg-background text-foreground border-muted placeholder:text-muted-foreground focus:ring-ring"
      />
      <Button
        onClick={handleFilter}
        className="w-full sm:w-auto text-sm font-medium"
      >
        Filter
      </Button>
    </div>
  );
}
