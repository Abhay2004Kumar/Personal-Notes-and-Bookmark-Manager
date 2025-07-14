export interface Note {
    _id: string;
    title: string;
    content?: string;
    tags: string[];
    favorite?: boolean;
    createdAt?: string;
  }
  
  export interface Bookmark {
    _id: string;
    url: string;
    title?: string;
    description?: string;
    tags: string[];
    favorite?: boolean;
    createdAt?: string;
  }
  