import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark, Category } from "@/types/bookmark";
import { CategorySuggestionsDropdown } from "./CategorySuggestionsDropdown";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface AISuggestionHandlerProps {
  selectedBookmarks: Set<string>;
  bookmarks: Bookmark[];
  onCategoryUpdate: (bookmarkId: string, category: string) => void;
  onAddCategory?: (category: Category) => void;
  onRefresh?: () => void;
}

export const AISuggestionHandler = ({
  selectedBookmarks,
  bookmarks,
  onCategoryUpdate,
  onAddCategory,
  onRefresh,
}: AISuggestionHandlerProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{
    bookmarkId: string;
    bookmarkTitle: string;
    suggestedCategory: string;
  }>>([]);

  const handleGetSuggestions = async () => {
    const selectedBookmarksList = bookmarks.filter(b => selectedBookmarks.has(b.id));
    
    if (selectedBookmarksList.length === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Please select bookmarks to suggest categories for",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      if (!window.ai?.languageModel) {
        throw new Error("Chrome's Language Model API not available");
      }

      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === "no") {
        throw new Error("Chrome's Language Model is not available on this device");
      }

      toast({
        title: "Processing",
        description: "Analyzing bookmarks and generating category suggestions...",
      });

      const session = await window.ai.languageModel.create({
        systemPrompt: "You are a bookmark categorization assistant. Suggest a single category from these options: Work, Personal, Shopping, Reading, Entertainment, Social, News, Development, Education, or Other. Only return the category name, nothing else."
      });

      const newSuggestions = [];

      for (const bookmark of selectedBookmarksList) {
        try {
          const context = `Title: ${bookmark.title}\nURL: ${bookmark.url}`;
          const response = await session.prompt(context);
          const suggestedCategory = response.trim()
            .split('\n')[0]
            .replace(/[."',]$/g, '')
            .trim();

          const validCategories = [
            'Work', 'Personal', 'Shopping', 'Reading', 'Entertainment',
            'Social', 'News', 'Development', 'Education', 'Other'
          ];

          const matchedCategory = validCategories.find(c => 
            c.toLowerCase() === suggestedCategory.toLowerCase()
          );

          if (matchedCategory) {
            newSuggestions.push({
              bookmarkId: bookmark.id,
              bookmarkTitle: bookmark.title,
              suggestedCategory: matchedCategory
            });
          }
        } catch (error) {
          console.error(`Error processing bookmark ${bookmark.title}:`, error);
        }
      }

      session.destroy();
      setSuggestions(newSuggestions);
      
      if (newSuggestions.length > 0) {
        toast({
          title: "Suggestions Ready",
          description: `Generated ${newSuggestions.length} category suggestions`,
        });
      } else {
        throw new Error("Could not generate any category suggestions");
      }
    } catch (error) {
      console.error('Error generating categories:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI suggestions",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptSuggestion = (bookmarkId: string, category: string) => {
    const aiCategory = {
      id: Date.now().toString(),
      name: category,
      isAISuggested: true
    };
    
    if (onAddCategory) {
      onAddCategory(aiCategory);
    }
    
    onCategoryUpdate(bookmarkId, category);
    setSuggestions(prev => prev.filter(s => s.bookmarkId !== bookmarkId));
    
    toast({
      title: "Category Added",
      description: `Added AI-suggested category: ${category}`,
    });

    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDeclineSuggestion = (bookmarkId: string) => {
    setSuggestions(prev => prev.filter(s => s.bookmarkId !== bookmarkId));
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGetSuggestions}
        disabled={selectedBookmarks.size === 0 || isProcessing}
        className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 min-w-[180px] justify-center"
      >
        {isProcessing ? (
          <LoadingSpinner />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        {isProcessing ? "Processing..." : "Suggest Categories"}
      </Button>
      <CategorySuggestionsDropdown
        suggestions={suggestions}
        onAcceptSuggestion={handleAcceptSuggestion}
        onDeclineSuggestion={handleDeclineSuggestion}
      />
    </div>
  );
};