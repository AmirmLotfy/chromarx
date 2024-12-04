import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Loader2, RefreshCcw, RotateCw, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { SummaryShareOptions } from "@/components/SummaryShareOptions";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";

interface MainSummaryPanelProps {
  bookmarks: Bookmark[];
  selectedBookmarks: Set<string>;
  selectedLanguage: SupportedLanguage;
  isGenerating: boolean;
  progress: number;
  summaries: Record<string, string>;
  handleGenerateSummaries: (bookmarks: Bookmark[]) => void;
  handleClearSummaries: () => void;
}

export const MainSummaryPanel = ({
  bookmarks,
  selectedBookmarks,
  isGenerating,
  progress,
  summaries,
  handleGenerateSummaries,
  handleClearSummaries,
}: MainSummaryPanelProps) => {
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

  const handleRegenerate = () => {
    if (selectedBookmarksList.length > 0) {
      handleGenerateSummaries(selectedBookmarksList);
      toast({
        title: "Regenerating summaries",
        description: `Regenerating summaries for ${selectedBookmarksList.length} bookmarks`,
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Summaries</h2>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {selectedBookmarksList.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateSummaries(selectedBookmarksList)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
              {Object.keys(summaries).length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSummaries}
                    disabled={isGenerating}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating summaries...</span>
          </div>
          <Progress value={progress} className="w-full h-1.5" />
        </div>
      )}

      <ScrollArea className="h-[400px]">
        {selectedBookmarksList.length === 0 || Object.keys(summaries).length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary/20" />
            <p>{selectedBookmarksList.length === 0 
              ? "Select bookmarks to see their AI summaries" 
              : "Generate summaries to see them here"}
            </p>
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

      {selectedBookmarksList.length > 0 && Object.keys(summaries).length > 0 && (
        <div className="pt-4 border-t border-border/10">
          <SummaryShareOptions onShare={handleShare} />
        </div>
      )}
    </Card>
  );
};