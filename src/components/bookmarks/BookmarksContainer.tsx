import { BookmarkFilters } from "./BookmarkFilters";
import { ControlsSection } from "../sections/ControlsSection";
import { BookmarkList } from "../BookmarkList";
import { AIFeatures } from "../AIFeatures";
import { Bookmark, Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { Separator } from "../ui/separator";
import { CategoryFilter } from "../CategoryFilter";

interface BookmarksContainerProps {
  filteredBookmarks: Bookmark[];
  selectedBookmark: Bookmark | null;
  selectedBookmarks: Set<string>;
  selectedCategory: string;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onSort: (type: string) => void;
  setSelectedBookmark: (bookmark: Bookmark | null) => void;
  handleBookmarkSelect: (bookmarkId: string | string[]) => void;
  handleCategoryUpdate: (bookmarkId: string, category: string) => void;
  handleGenerateSummaries: (bookmarks: Bookmark[]) => void;
  settings: { enableAI: boolean; privacyMode: boolean };
  isGenerating?: boolean;
  progress?: number;
  onBookmarksRemoved?: (bookmarkIds: string[]) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onRefresh?: () => void;
  categories?: Category[];
  focusModeEnabled: boolean;
  entertainmentModeEnabled: boolean;
  setFocusModeEnabled: (enabled: boolean) => void;
  setEntertainmentModeEnabled: (enabled: boolean) => void;
}

export const BookmarksContainer = ({
  filteredBookmarks,
  selectedBookmark,
  selectedBookmarks,
  selectedCategory,
  selectedLanguage,
  onLanguageChange,
  onCategoryChange,
  onSearch,
  onSort,
  setSelectedBookmark,
  handleBookmarkSelect,
  handleCategoryUpdate,
  handleGenerateSummaries,
  settings,
  isGenerating,
  progress,
  onBookmarksRemoved,
  onAddCategory,
  onDeleteCategory,
  onRefresh,
  categories = [],
  focusModeEnabled,
  entertainmentModeEnabled,
  setFocusModeEnabled,
  setEntertainmentModeEnabled,
}: BookmarksContainerProps) => {
  // Calculate bookmark counts per category
  const bookmarkCounts = filteredBookmarks.reduce((acc, bookmark) => {
    acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
    acc['all'] = (acc['all'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter bookmarks based on selected category
  const displayedBookmarks = selectedCategory === 'all' 
    ? filteredBookmarks 
    : filteredBookmarks.filter(bookmark => bookmark.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-sm">
        <BookmarkFilters
          selectedCategory={selectedCategory}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          onCategoryChange={onCategoryChange}
          onSearch={onSearch}
          categories={categories}
          isGenerating={isGenerating}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
          onDeleteCategory={onDeleteCategory}
          bookmarkCounts={bookmarkCounts}
          className="animate-fadeIn"
        />

        <Separator className="my-6" />

        <ControlsSection
          focusModeEnabled={focusModeEnabled}
          entertainmentModeEnabled={entertainmentModeEnabled}
          setFocusModeEnabled={setFocusModeEnabled}
          setEntertainmentModeEnabled={setEntertainmentModeEnabled}
          onSort={onSort}
          displayedBookmarks={displayedBookmarks}
          selectedBookmarks={selectedBookmarks}
          onSelectAll={() => handleBookmarkSelect(displayedBookmarks.map(b => b.id))}
          onClearSelection={() => handleBookmarkSelect([])}
          onRemoveBookmarks={onBookmarksRemoved || (() => {})}
        />

        {settings.enableAI && (
          <AIFeatures
            currentBookmark={selectedBookmark || undefined}
            selectedBookmarks={selectedBookmarks}
            bookmarks={displayedBookmarks}
            onCategoryUpdate={handleCategoryUpdate}
            onGenerateSummaries={handleGenerateSummaries}
            onAddCategory={onAddCategory}
            isGenerating={isGenerating}
            progress={progress}
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            onRefresh={onRefresh}
          />
        )}

        <BookmarkList
          bookmarks={displayedBookmarks}
          onBookmarkSelect={setSelectedBookmark}
          selectedBookmark={selectedBookmark || undefined}
          selectedBookmarks={selectedBookmarks}
          onBookmarkSelectToggle={handleBookmarkSelect}
          settings={settings}
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onAddAISuggestion={(suggestion: string) => {
            const isDuplicate = categories.some(
              cat => cat.name.toLowerCase() === suggestion.toLowerCase()
            );
            if (!isDuplicate) {
              onAddCategory({
                id: Date.now().toString(),
                name: suggestion,
                isAISuggested: true
              });
            }
          }}
          onSort={onSort}
          onRemoveBookmarks={onBookmarksRemoved || (() => {})}
        />
      </div>
    </div>
  );
};