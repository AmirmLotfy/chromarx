import { Bookmark } from "@/types/bookmark";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { BookmarkActions } from "../BookmarkActions";

interface BookmarkGroupProps {
  domain: string;
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
}

export const BookmarkGroup = ({ domain, bookmarks, onBookmarkSelect }: BookmarkGroupProps) => {
  const totalVisits = bookmarks.reduce((sum, bookmark) => sum + (bookmark.visitCount || 0), 0);

  return (
    <Card className="domain-group animate-fade-in">
      <div className="domain-header">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="domain-title">{domain}</h3>
        </div>
        <span className="domain-stats">
          {bookmarks.length} bookmarks • {totalVisits} visits
        </span>
      </div>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            onClick={() => onBookmarkSelect(bookmark)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              bookmark.visitCount && bookmark.visitCount > 5
                ? 'bookmark-item most-visited'
                : 'bookmark-item hover:bg-accent/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{bookmark.title}</span>
              {bookmark.visitCount && bookmark.visitCount > 0 && (
                <span className="visit-count">
                  {bookmark.visitCount} visits
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate block mt-1">
              {bookmark.url}
            </span>
            <BookmarkActions bookmark={bookmark} />
          </div>
        ))}
      </div>
    </Card>
  );
};