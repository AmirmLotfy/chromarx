import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import ReactMarkdown from 'react-markdown';

interface SummaryHistoryPanelProps {
  bookmarks: Bookmark[];
  summaries: Record<string, string>;
}

export const SummaryHistoryPanel = ({ bookmarks, summaries }: SummaryHistoryPanelProps) => {
  const summaryEntries = Object.entries(summaries).slice(-5); // Show last 5 summaries

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Recent Summaries</h3>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {summaryEntries.map(([bookmarkId, summary]) => {
            const bookmark = bookmarks.find(b => b.id === bookmarkId);
            if (!bookmark) return null;

            return (
              <div key={bookmarkId} className="space-y-2">
                <h4 className="text-xs font-medium text-foreground/80">{bookmark.title}</h4>
                <div className="prose prose-xs dark:prose-invert max-w-none bg-primary/5 p-2 rounded-md">
                  <ReactMarkdown>
                    {summary.length > 150 ? `${summary.slice(0, 150)}...` : summary}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};