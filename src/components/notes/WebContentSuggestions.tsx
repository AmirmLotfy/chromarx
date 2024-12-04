import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Globe, Plus } from "lucide-react";
import { searchGoogle } from "@/utils/searchUtils";
import { generateSummary } from "@/utils/aiUtils";
import { useToast } from "@/components/ui/use-toast";

interface WebContentSuggestion {
  title: string;
  url: string;
  summary?: string;
}

interface WebContentSuggestionsProps {
  noteTitle: string;
  noteContent: string;
  onContentAdd: (content: string) => void;
}

export const WebContentSuggestions = ({
  noteTitle,
  noteContent,
  onContentAdd,
}: WebContentSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<WebContentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      // Combine title and content for better search results
      const searchQuery = `${noteTitle} ${noteContent.slice(0, 100)}`;
      const results = await searchGoogle(searchQuery);
      setSuggestions(results);

      // Generate summaries for each result
      const updatedSuggestions = await Promise.all(
        results.map(async (result) => {
          const summary = await generateSummary(
            `Please provide a brief summary of this content: ${result.title}\n${result.url}`
          );
          return { ...result, summary };
        })
      );

      setSuggestions(updatedSuggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content suggestions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContent = async (suggestion: WebContentSuggestion) => {
    if (!suggestion.summary) return;
    
    const formattedContent = `\n\nRelated Content from ${suggestion.title}:\n${suggestion.url}\n\n${suggestion.summary}`;
    onContentAdd(formattedContent);
    
    toast({
      title: "Content Added",
      description: "Related content has been added to your note",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Web Content Suggestions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSuggestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          Find Related Content
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="p-3 hover:bg-accent/5 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                  <a
                    href={suggestion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary truncate block"
                  >
                    {suggestion.url}
                  </a>
                  {suggestion.summary && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {suggestion.summary}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddContent(suggestion)}
                  className="flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {!isLoading && suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Find Related Content" to get suggestions based on your note
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};