import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types/bookmark";
import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityTimelineProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const ActivityTimeline = ({ bookmarks, className }: ActivityTimelineProps) => {
  const sortedBookmarks = [...bookmarks]
    .sort((a, b) => b.dateAdded - a.dateAdded)
    .slice(0, 10);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {sortedBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{bookmark.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(bookmark.dateAdded).toLocaleDateString()} at{" "}
                    {new Date(bookmark.dateAdded).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
