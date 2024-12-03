import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Globe, Star } from "lucide-react";
import { Bookmark } from "@/types/bookmark";

interface BookmarkStatsProps {
  bookmarks: Bookmark[];
}

export const BookmarkStats = ({ bookmarks }: BookmarkStatsProps) => {
  const getTotalVisits = () => {
    return bookmarks.reduce((total, bookmark) => total + (bookmark.visitCount || 0), 0);
  };

  const getAverageTimeSpent = () => {
    const totalTime = bookmarks.reduce((total, bookmark) => total + (bookmark.timeSpent || 0), 0);
    return bookmarks.length ? Math.round(totalTime / bookmarks.length / 60000) : 0; // Convert to minutes
  };

  const getMostVisitedDomain = () => {
    const domainCounts = bookmarks.reduce((acc, bookmark) => {
      const domain = bookmark.domain || new URL(bookmark.url).hostname;
      acc[domain] = (acc[domain] || 0) + (bookmark.visitCount || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <h3 className="text-sm font-medium">Total Visits</h3>
        </div>
        <p className="text-2xl font-bold">{getTotalVisits()}</p>
      </Card>
      
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Avg. Time (min)</h3>
        </div>
        <p className="text-2xl font-bold">{getAverageTimeSpent()}</p>
      </Card>
      
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">Most Visited Domain</h3>
        </div>
        <p className="text-lg font-medium truncate">{getMostVisitedDomain()}</p>
      </Card>
    </div>
  );
};