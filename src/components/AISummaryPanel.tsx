import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bookmark } from "@/types/bookmark";
import { Loader2, RefreshCcw, BookOpen } from "lucide-react";
import { SummaryShareOptions } from "@/components/SummaryShareOptions";
import { useToast } from "@/components/ui/use-toast";
import { SupportedLanguage } from "@/utils/translationUtils";
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AISummaryPanelProps {
  bookmarks: Bookmark[];
  onCategoryUpdate: (bookmarkId: string, category: string) => void;
  onClearSummaries?: () => void;
  isGenerating?: boolean;
  progress?: number;
  summaries?: Record<string, string>;
  selectedLanguage: SupportedLanguage;
  selectedBookmarks: Set<string>;
}

export const AISummaryPanel = ({
  bookmarks,
  onCategoryUpdate,
  onClearSummaries,
  isGenerating = false,
  progress = 0,
  summaries = {},
  selectedLanguage,
  selectedBookmarks,
}: AISummaryPanelProps) => {
  const { toast } = useToast();

  const selectedBookmarksList = bookmarks.filter(bookmark => selectedBookmarks.has(bookmark.id));

  const handleShare = (type: 'whatsapp' | 'email' | 'copy') => {
    const summaryText = selectedBookmarksList
      .map(bookmark => {
        const summary = summaries[bookmark.id];
        return `${bookmark.title}\n${bookmark.url}\n${summary || 'No summary available'}`;
      })
      .join('\n\n');

    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(summaryText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Bookmark Summaries&body=${encodeURIComponent(summaryText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(summaryText);
        toast({
          title: "Copied to clipboard",
          description: "Summaries have been copied to your clipboard",
        });
        break;
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-background/50 backdrop-blur-sm border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Summary
          </h2>
        </div>
        {onClearSummaries && selectedBookmarksList.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSummaries}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            disabled={isGenerating}
          >
            <RefreshCcw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-3 animate-pulse">
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating summaries...</span>
          </div>
          <Progress value={progress} className="w-full h-1.5" />
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-300px)]">
        {selectedBookmarksList.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 px-4">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary/20" />
            <p className="text-sm">Select bookmarks to see their AI summaries</p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedBookmarksList.map((bookmark) => (
              <div key={bookmark.id} className="space-y-3 group">
                <div className="space-y-1.5">
                  <h3 className="font-medium text-foreground/90 group-hover:text-primary transition-colors">
                    {bookmark.title}
                  </h3>
                  <a 
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary/70 hover:text-primary truncate block transition-colors"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-primary/5 p-4 rounded-lg">
                  <ReactMarkdown>
                    {summaries[bookmark.id] || "No summary available"}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {selectedBookmarksList.length > 0 && (
        <div className="pt-4 border-t border-border/10">
          <SummaryShareOptions onShare={handleShare} />
        </div>
      )}
    </Card>
  );
};