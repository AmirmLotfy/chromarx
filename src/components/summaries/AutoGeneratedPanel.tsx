import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import ReactMarkdown from 'react-markdown';

interface AutoGeneratedPanelProps {
  bookmarks: Bookmark[];
  summaries: Record<string, string>;
}

export const AutoGeneratedPanel = ({ bookmarks, summaries }: AutoGeneratedPanelProps) => {
  // Filter for auto-generated summaries (only show summaries for bookmarks that were auto-generated)
  const autoGenerated = Object.entries(summaries)
    .filter(([bookmarkId]) => {
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      return bookmark?.isAutoGenerated;
    })
    .slice(-3); // Show last 3 auto-generated

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Auto-Generated Summaries</h3>
      </div>
      <ScrollArea className="h-[200px]">
        {autoGenerated.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">No auto-generated summaries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {autoGenerated.map(([bookmarkId, summary]) => {
              const bookmark = bookmarks.find(b => b.id === bookmarkId);
              if (!bookmark) return null;

              return (
                <div key={bookmarkId} className="space-y-2">
                  <h4 className="text-xs font-medium text-foreground/80">{bookmark.title}</h4>
                  <div className="prose prose-xs dark:prose-invert max-w-none bg-primary/5 p-2 rounded-md">
                    <ReactMarkdown>
                      {summary.length > 100 ? `${summary.slice(0, 100)}...` : summary}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};