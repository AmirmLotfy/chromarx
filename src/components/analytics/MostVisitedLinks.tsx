import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types/bookmark";
import { Link } from "lucide-react";

interface MostVisitedLinksProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const MostVisitedLinks = ({ bookmarks, className }: MostVisitedLinksProps) => {
  // In a real implementation, this would use actual visit data
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Most Visited Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedBookmarks.map((bookmark) => (
            <li key={bookmark.id} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bookmark.title}</p>
                <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
