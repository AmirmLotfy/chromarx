import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark } from "@/types/bookmark";
import ReactMarkdown from 'react-markdown';

interface SummaryListProps {
  bookmarks: Bookmark[];
  summaries: Record<string, string>;
}

export const SummaryList = ({ bookmarks, summaries }: SummaryListProps) => {
  // Format summaries for non-English languages
  const formatSummary = (text: string) => {
    // Remove any asterisks that aren't part of markdown syntax
    const cleanText = text.replace(/(?<!\*)\*(?!\*)/g, '');
    // Ensure proper spacing for list items
    return cleanText.replace(/^[•\-]\s*/gm, '* ');
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="mb-6">
          <h3 className="text-sm text-foreground/80 mb-2">{bookmark.title}</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {formatSummary(summaries[bookmark.id] || bookmark.summary || 'No summary generated yet')}
            </ReactMarkdown>
          </div>
          <div className="border-b border-border/50 mt-4" />
        </div>
      ))}
    </ScrollArea>
  );
};