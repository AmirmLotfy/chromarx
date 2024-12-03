import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FeatureButtons } from "@/components/FeatureButtons";
import { AIFeatures } from "@/components/AIFeatures";
import { CleanupDialog } from "@/components/CleanupDialog";
import { LanguageSelector } from "@/components/LanguageSelector";
import { FocusMode } from "@/components/FocusMode";
import { EntertainmentMode } from "@/components/EntertainmentMode";
import { BookmarkStats } from "@/components/dashboard/BookmarkStats";
import { BookmarkGroup } from "@/components/bookmark/BookmarkGroup";
import { Bookmark, Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { filterFocusBookmarks, filterEntertainmentBookmarks, groupBookmarksByDomain } from "@/utils/focusModeUtils";
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

  const groupedBookmarks = groupBookmarksByDomain(displayedBookmarks);

  return (
    <div className="content-wrapper">
      <div className="space-y-6 p-6 rounded-lg">
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

        <BookmarkStats bookmarks={displayedBookmarks} />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
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

          <div className="flex flex-wrap gap-2">
            <FeatureButtons 
              onSort={onSort} 
              bookmarks={displayedBookmarks}
              selectedBookmarks={selectedBookmarks}
              onSelectAll={() => handleBookmarkSelect(displayedBookmarks.map(b => b.id))}
              onClearSelection={() => handleBookmarkSelect([])}
            />
            <CleanupDialog 
              bookmarks={displayedBookmarks}
              onRemoveBookmarks={onBookmarksRemoved}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {settings.enableAI && (
          <div className="mb-6">
            <AIFeatures 
              currentBookmark={selectedBookmark}
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

        <div className="space-y-6">
          {Object.entries(groupedBookmarks).map(([domain, domainBookmarks]) => (
            <BookmarkGroup
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