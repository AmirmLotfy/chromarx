import { Bookmark } from "@/types/bookmark";
import { Card } from "@/components/ui/card";
import { ExternalLink, Search, BookmarkIcon, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  relatedBookmarks?: Bookmark[];
  webResults?: Array<{ title: string; url: string }>;
  onBookmarkSelect?: (bookmark: Bookmark) => void;
}

interface CodeProps {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}

export const ChatMessage = ({ 
  role, 
  content, 
  relatedBookmarks, 
  webResults,
  onBookmarkSelect 
}: ChatMessageProps) => {
  const isRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(content);
  
  const formatContent = (text: string) => {
    // Clean any unwanted asterisks
    let cleanText = text.replace(/(?<!\*)\*(?!\*)/g, '');
    
    // Format lists consistently
    cleanText = cleanText.replace(/^[•\-]\s*/gm, '- ');
    
    // Handle special characters and punctuation for RTL/non-English languages
    if (isRTL || /[àáâãäçèéêëìíîïñòóôõöùúûüýÿ]/i.test(text)) {
      // Format sentences and punctuation without making them bold
      cleanText = cleanText
        .replace(/([.!?]+)/g, '$1')
        .replace(/([،؛؟])/g, '$1')
        // Add proper spacing around punctuation
        .replace(/\s*([.!?،؛؟])\s*/g, '$1 ');
        
      // Ensure proper paragraph breaks
      cleanText = cleanText.split('\n').map(line => line.trim()).join('\n\n');
    }
    
    return cleanText;
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} fade-in group`}>
      <div className="flex gap-3 max-w-[85%]">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          role === 'user' 
            ? "bg-primary/10 text-primary" 
            : "bg-secondary/10 text-secondary"
        )}>
          {role === 'user' ? <User size={12} /> : <Bot size={12} />}
        </div>
        
        <div 
          className={cn(
            "rounded-lg p-3 space-y-3",
            role === 'user' 
              ? "bg-primary/5 text-foreground" 
              : "bg-secondary/5 backdrop-blur-sm"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={cn(
            "prose prose-sm max-w-none",
            "prose-p:my-1.5 prose-headings:font-normal",
            "prose-p:leading-relaxed prose-p:text-sm",
            "prose-strong:font-medium prose-strong:text-foreground/90",
            isRTL ? "rtl text-right" : "ltr text-left"
          )}>
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className={`leading-relaxed whitespace-pre-wrap text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                    {children}
                  </p>
                ),
                code: ({ children, className, inline }: CodeProps) => (
                  <code
                    className={cn(
                      "bg-muted/50 rounded px-1.5 py-0.5 text-xs font-normal",
                      inline ? "text-xs" : "block p-2 my-2 overflow-x-auto"
                    )}
                    dir="ltr"
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {formatContent(content)}
            </ReactMarkdown>
          </div>
          
          {(relatedBookmarks?.length > 0 || webResults?.length > 0) && (
            <ScrollArea className="h-full max-h-[200px]">
              {webResults && webResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Search className="h-3 w-3" />
                    <span>Web Results</span>
                  </div>
                  <div className="grid gap-1.5">
                    {webResults.map((result, index) => (
                      <Card key={index} className="p-2 hover:bg-accent/5 transition-all duration-200">
                        <a 
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 group"
                        >
                          <ExternalLink className="h-3 w-3 flex-shrink-0 text-primary/50 group-hover:text-primary" />
                          <div className="overflow-hidden">
                            <p className="text-xs truncate group-hover:text-primary transition-colors">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.url}</p>
                          </div>
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {relatedBookmarks && relatedBookmarks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookmarkIcon className="h-3 w-3" />
                    <span>Related Bookmarks</span>
                  </div>
                  <div className="grid gap-1.5">
                    {relatedBookmarks.map((bookmark, index) => (
                      <a
                        key={index}
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          onBookmarkSelect?.(bookmark);
                          window.open(bookmark.url, '_blank');
                        }}
                      >
                        <Card 
                          className="p-2 cursor-pointer hover:bg-accent/5 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <BookmarkIcon className="h-3 w-3 flex-shrink-0 text-primary/50" />
                            <div className="overflow-hidden">
                              <p className="text-xs truncate">{bookmark.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                            </div>
                          </div>
                        </Card>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};