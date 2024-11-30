import { Bookmark, Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { AIActionButtons } from "./AIActionButtons";
import { AIProgressBar } from "./AIProgressBar";
import { AISuggestionHandler } from "./AISuggestionHandler";
import { Separator } from "./ui/separator";

interface AIFeaturesProps {
  currentBookmark?: Bookmark;
  selectedBookmarks: Set<string>;
  bookmarks: Bookmark[];
  onCategoryUpdate: (bookmarkId: string, category: string) => void;
  onGenerateSummaries?: (bookmarks: Bookmark[], language: SupportedLanguage) => void;
  onAddCategory?: (category: Category) => void;
  isGenerating?: boolean;
  progress?: number;
  selectedLanguage: SupportedLanguage;
  onRefresh?: () => void;
}

export const AIFeatures = ({ 
  selectedBookmarks,
  bookmarks,
  onCategoryUpdate, 
  onGenerateSummaries,
  onAddCategory,
  isGenerating = false,
  progress = 0,
  selectedLanguage,
  onRefresh,
}: AIFeaturesProps) => {
  const handleGenerateSummaries = () => {
    if (onGenerateSummaries) {
      const selectedBookmarksList = bookmarks.filter(b => selectedBookmarks.has(b.id));
      onGenerateSummaries(selectedBookmarksList, selectedLanguage);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-border/50">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <AISuggestionHandler
              selectedBookmarks={selectedBookmarks}
              bookmarks={bookmarks}
              onCategoryUpdate={onCategoryUpdate}
              onAddCategory={onAddCategory}
              onRefresh={onRefresh}
            />
          </div>
          <AIActionButtons
            selectedCount={selectedBookmarks.size}
            isGenerating={isGenerating}
            onGenerateSummaries={handleGenerateSummaries}
            selectedLanguage={selectedLanguage}
          />
        </div>
        <AIProgressBar isGenerating={isGenerating} progress={progress} />
      </div>
    </div>
  );
};