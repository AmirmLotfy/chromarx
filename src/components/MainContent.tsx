import { BookmarksContainer } from "./bookmarks/BookmarksContainer";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { filterFocusBookmarks, filterEntertainmentBookmarks } from "@/utils/focusModeUtils";
import { Bookmark } from "@/types/bookmark";

interface MainContentProps {
  filteredBookmarks: Bookmark[];
  selectedBookmark: Bookmark | null;
  selectedBookmarks: Set<string>;
  selectedCategory: string;
  selectedLanguage: any;
  onLanguageChange: (language: any) => void;
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
  categories?: any[];
}

export const MainContent = ({
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
  isGenerating = false,
  progress = 0,
  onBookmarksRemoved,
  onAddCategory,
  onDeleteCategory,
  onRefresh,
  categories = [],
}: MainContentProps) => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [entertainmentModeEnabled, setEntertainmentModeEnabled] = useState(false);
  const { toast } = useToast();
  
  const displayedBookmarks = focusModeEnabled 
    ? filterFocusBookmarks(filteredBookmarks)
    : entertainmentModeEnabled
    ? filterEntertainmentBookmarks(filteredBookmarks)
    : filteredBookmarks;

  const handleFocusModeToggle = () => {
    if (entertainmentModeEnabled) {
      setEntertainmentModeEnabled(false);
    }
    setFocusModeEnabled(!focusModeEnabled);
    toast({
      title: !focusModeEnabled ? "Focus Mode Enabled" : "Focus Mode Disabled",
      description: !focusModeEnabled 
        ? "Showing only work and productivity related bookmarks" 
        : "Showing all bookmarks",
    });
  };

  const handleEntertainmentModeToggle = () => {
    if (focusModeEnabled) {
      setFocusModeEnabled(false);
    }
    setEntertainmentModeEnabled(!entertainmentModeEnabled);
    toast({
      title: !entertainmentModeEnabled ? "Fun Mode Enabled" : "Fun Mode Disabled",
      description: !entertainmentModeEnabled 
        ? "Showing only entertainment related bookmarks" 
        : "Showing all bookmarks",
    });
  };

  return (
    <div className="w-full h-full">
      <div className="p-2 md:p-4 space-y-4">
        <BookmarksContainer
          filteredBookmarks={displayedBookmarks}
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
          focusModeEnabled={focusModeEnabled}
          entertainmentModeEnabled={entertainmentModeEnabled}
          setFocusModeEnabled={handleFocusModeToggle}
          setEntertainmentModeEnabled={handleEntertainmentModeToggle}
        />
      </div>
    </div>
  );
};