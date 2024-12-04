import { Bookmark, Category } from "@/types/bookmark";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryManager } from "./CategoryManager";
import { useState } from "react";
import { DomainGroup } from "./bookmark/DomainGroup";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedBookmark?: Bookmark;
  selectedBookmarks: Set<string>;
  onBookmarkSelectToggle: (id: string) => void;
  settings?: {
    privacyMode: boolean;
  };
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddAISuggestion: (suggestion: string) => void;
  onSort: (type: string) => void;
  onRemoveBookmarks: (bookmarkIds: string[]) => void;
}

export const BookmarkList = ({
  bookmarks,
  onBookmarkSelect,
  selectedBookmark,
  selectedBookmarks,
  onBookmarkSelectToggle,
  settings = { privacyMode: false },
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddAISuggestion,
  onSort,
  onRemoveBookmarks,
}: BookmarkListProps) => {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "unknown";
    }
  };

  const bookmarksByDomain = bookmarks.reduce((acc, bookmark) => {
    const domain = getDomainFromUrl(bookmark.url);
    if (!acc[domain]) {
      acc[domain] = {
        bookmarks: [],
        totalVisits: 0,
      };
    }
    acc[domain].bookmarks.push(bookmark);
    acc[domain].totalVisits += bookmark.visits || 0;
    return acc;
  }, {} as Record<string, { bookmarks: Bookmark[], totalVisits: number }>);

  const toggleDomain = (domain: string) => {
    const newExpandedDomains = new Set(expandedDomains);
    if (newExpandedDomains.has(domain)) {
      newExpandedDomains.delete(domain);
    } else {
      newExpandedDomains.add(domain);
    }
    setExpandedDomains(newExpandedDomains);
  };

  return (
    <div className="space-y-6">
      <CategoryManager 
        categories={categories} 
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onAddAISuggestion={onAddAISuggestion}
      />
      
      <ScrollArea className="h-[600px] rounded-xl border border-accent/20 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-8">
          {Object.entries(bookmarksByDomain).map(([domain, data]) => (
            <DomainGroup
              key={domain}
              domain={domain}
              data={data}
              isExpanded={expandedDomains.has(domain)}
              onToggle={() => toggleDomain(domain)}
              onBookmarkSelect={onBookmarkSelect}
              selectedBookmark={selectedBookmark}
              selectedBookmarks={selectedBookmarks}
              onBookmarkSelectToggle={onBookmarkSelectToggle}
              settings={settings}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};