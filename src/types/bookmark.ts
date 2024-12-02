export interface Bookmark {
  id: string;
  title: string;
  url: string;
  dateAdded: number;
  category: string;
  description?: string;
  tags?: string[];
  isFavorite?: boolean;
  parentId?: string;
  isSelected?: boolean;
  summary?: string;
  visitCount?: number;
  domain?: string;
}

export interface Category {
  id: string;
  name: string;
  isAISuggested?: boolean;
}