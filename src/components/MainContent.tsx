import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FeatureButtons } from "@/components/FeatureButtons";
import { AIFeatures } from "@/components/AIFeatures";
import { CleanupDialog } from "@/components/CleanupDialog";
import { BookmarkList } from "@/components/BookmarkList";
import { LanguageSelector } from "@/components/LanguageSelector";
import { FocusMode } from "@/components/FocusMode";
import { EntertainmentMode } from "@/components/EntertainmentMode";
import { TimeDashboard } from "@/components/TimeDashboard"; // Importing TimeDashboard
import { DomainGroup } from "@/components/DomainGroup"; // Importing DomainGroup
import { Bookmark, Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { filterFocusBookmarks, filterEntertainmentBookmarks } from "@/utils/focusModeUtils";
import { useState } from "react";
import { Separator } from "./ui/separator";

interface MainContentProps {
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
  
  const displayedBookmarks = focusModeEnabled 
    ? filterFocusBookmarks(filteredBookmarks)
    : entertainmentModeEnabled
    ? filterEntertainmentBookmarks(filteredBookmarks)
    : filteredBookmarks;

  // Group bookmarks by domain
  const groupedBookmarks = displayedBookmarks.reduce((groups, bookmark) => {
    const domain = new URL(bookmark.url).hostname;
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(bookmark);
    return groups;
  }, {} as Record<string, Bookmark[]>);

  const handleRemoveBookmarks = async (bookmarkIds: string[]) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      try {
        await Promise.all(bookmarkIds.map(id => chrome.bookmarks.remove(id)));
        onBookmarksRemoved?.(bookmarkIds);
      } catch (error) {
        console.error('Error removing bookmarks:', error);
      }
    }
  };

  const handleSelectAll = () => {
    const newSelected = filteredBookmarks.map(b => b.id);
    setSelectedBookmark(null);
    handleBookmarkSelect(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedBookmark(null);
    handleBookmarkSelect([]);
  };

  return (
    <div className="col-span-2">
      <div className="space-y-6 p-6 rounded-lg">
        {/* Search and Category Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-6">
            <SearchBar onSearch={onSearch} />
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              disabled={isGenerating}
            />
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            categories={categories}
          />
        </div>

        <Separator className="my-6" />

        {/* Time Dashboard */}
        <TimeDashboard bookmarks={displayedBookmarks} />

        {/* Controls Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Mode Toggles */}
            <div className="flex gap-2">
              <FocusMode 
                enabled={focusModeEnabled}
                onToggle={() => {
                  setFocusModeEnabled(!focusModeEnabled);
                  if (entertainmentModeEnabled) setEntertainmentModeEnabled(false);
                }}
              />
              <EntertainmentMode
                enabled={entertainmentModeEnabled}
                onToggle={() => {
                  setEntertainmentModeEnabled(!entertainmentModeEnabled);
                  if (focusModeEnabled) setFocusModeEnabled(false);
                }}
              />
            </div>
          </div>

          {/* Feature Buttons */}
          <div className="flex flex-wrap gap-2">
            <FeatureButtons 
              onSort={onSort} 
              bookmarks={displayedBookmarks}
              selectedBookmarks={selectedBookmarks}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
            />
            <CleanupDialog 
              bookmarks={displayedBookmarks}
              onRemoveBookmarks={handleRemoveBookmarks}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* AI Features Section */}
        {settings.enableAI && (
          <div className="mb-6">
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
              onRefresh={onRefresh}
            />
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-6">
          {Object.entries(groupedBookmarks).map(([domain, domainBookmarks]) => (
            <DomainGroup
              key={domain}
              domain={domain}
              bookmarks={domainBookmarks}
              onBookmarkSelect={setSelectedBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
