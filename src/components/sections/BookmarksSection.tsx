import { MainContent } from "@/components/MainContent";
import { Bookmark, Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";

interface BookmarksSectionProps {
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
  onAddCategory: (category: any) => void;
  onDeleteCategory: (categoryId: string) => void;
  onRefresh?: () => void;
  onClearSummaries?: () => void;
  summaries?: Record<string, string>;
  categories?: Category[];
}

export const BookmarksSection = ({
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
}: BookmarksSectionProps) => {
  return (
    <MainContent
      filteredBookmarks={filteredBookmarks}
      selectedBookmark={selectedBookmark}
      selectedBookmarks={selectedBookmarks}
      selectedCategory={selectedCategory}
      selectedLanguage={selectedLanguage}
      onLanguageChange={onLanguageChange}
      onCategoryChange={onCategoryChange}
      onSearch={onSearch}
      onSort={onSort}
      setSelectedBookmark={setSelectedBookmark}
      handleBookmarkSelect={handleBookmarkSelect}
      handleCategoryUpdate={handleCategoryUpdate}
      handleGenerateSummaries={handleGenerateSummaries}
      settings={settings}
      isGenerating={isGenerating}
      progress={progress}
      onBookmarksRemoved={onBookmarksRemoved}
      onAddCategory={onAddCategory}
      onDeleteCategory={onDeleteCategory}
      onRefresh={onRefresh}
      categories={categories}
    />
  );
};