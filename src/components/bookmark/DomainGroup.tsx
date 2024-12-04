import { Bookmark } from "@/types/bookmark";
import { Card } from "../ui/card";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { BookmarkItem } from "./BookmarkItem";

interface DomainGroupProps {
  domain: string;
  data: {
    bookmarks: Bookmark[];
    totalVisits: number;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedBookmark?: Bookmark;
  selectedBookmarks: Set<string>;
  onBookmarkSelectToggle: (id: string) => void;
  settings?: {
    privacyMode: boolean;
  };
}

export const DomainGroup = ({
  domain,
  data,
  isExpanded,
  onToggle,
  onBookmarkSelect,
  selectedBookmark,
  selectedBookmarks,
  onBookmarkSelectToggle,
  settings = { privacyMode: false },
}: DomainGroupProps) => {
  return (
    <div className="space-y-3">
      <Card 
        className="p-4 cursor-pointer hover:bg-accent/5 transition-colors border-accent/20 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground/70" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground/70" />
            )}
            <h3 className="text-sm font-medium text-foreground/90">{domain}</h3>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground/70">
            <span>{data.bookmarks.length} bookmarks</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {data.totalVisits}
            </span>
          </div>
        </div>
      </Card>
      {isExpanded && (
        <div className="space-y-2 pl-4 animate-accordion-down">
          {data.bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              isSelected={selectedBookmark?.id === bookmark.id}
              isChecked={selectedBookmarks.has(bookmark.id)}
              onSelect={() => onBookmarkSelect(bookmark)}
              onToggleCheck={() => onBookmarkSelectToggle(bookmark.id)}
              privacyMode={settings.privacyMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};