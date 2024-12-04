import { BookmarksSection } from "@/components/sections/BookmarksSection";
import { ChatSection } from "@/components/sections/ChatSection";
import { SummariesSection } from "@/components/sections/SummariesSection";
import { useState, useEffect } from "react";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { useSummaryState } from "@/hooks/useSummaryState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";

export const AIZoneTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNewSummaries, setHasNewSummaries] = useState(false);
  const { toast } = useToast();

  const {
    bookmarks,
    filteredBookmarks,
    handleCategoryUpdate,
    handleBookmarksRemoved,
    onAddCategory,
    onDeleteCategory,
    onRefresh,
    categories,
    filterBookmarks
  } = useBookmarks();

  const {
    selectedBookmark,
    setSelectedBookmark,
    selectedBookmarks,
    handleBookmarkSelect,
    selectedLanguage,
    setSelectedLanguage,
    isGenerating,
    progress,
    summaries,
    handleGenerateSummaries: originalHandleGenerateSummaries,
    handleClearSummaries
  } = useSummaryState();

  const handleGenerateSummaries = async (bookmarks: Bookmark[]) => {
    await originalHandleGenerateSummaries(bookmarks);
    setHasNewSummaries(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterBookmarks(query, selectedCategory);
  };

  const handleSort = (type: string) => {
    toast({
      title: "Sorting applied",
      description: `Bookmarks sorted by ${type}`,
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <Tabs defaultValue="bookmarks" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm border-b border-border/20 rounded-none px-4">
          <TabsTrigger 
            value="bookmarks"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all duration-200"
          >
            Bookmarks
          </TabsTrigger>
          <TabsTrigger 
            value="summaries" 
            className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all duration-200"
            onClick={() => setHasNewSummaries(false)}
          >
            Summaries
            {hasNewSummaries && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="chat"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all duration-200"
          >
            Chat Assistant
          </TabsTrigger>
        </TabsList>
        
        <div className="h-[calc(100%-3rem)] overflow-hidden">
          <TabsContent 
            value="bookmarks" 
            className="mt-0 h-full overflow-y-auto px-4 py-2 focus-visible:outline-none bg-transparent border-0 shadow-none"
          >
            <BookmarksSection
              filteredBookmarks={filteredBookmarks}
              selectedBookmark={selectedBookmark}
              selectedBookmarks={selectedBookmarks}
              selectedCategory={selectedCategory}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onCategoryChange={setSelectedCategory}
              onSearch={handleSearch}
              onSort={handleSort}
              setSelectedBookmark={setSelectedBookmark}
              handleBookmarkSelect={handleBookmarkSelect}
              handleCategoryUpdate={handleCategoryUpdate}
              handleGenerateSummaries={handleGenerateSummaries}
              settings={{ enableAI: true, privacyMode: false }}
              isGenerating={isGenerating}
              progress={progress}
              onBookmarksRemoved={handleBookmarksRemoved}
              onAddCategory={onAddCategory}
              onDeleteCategory={onDeleteCategory}
              onRefresh={onRefresh}
              onClearSummaries={handleClearSummaries}
              summaries={summaries}
              categories={categories}
            />
          </TabsContent>

          <TabsContent 
            value="summaries"
            className="mt-0 h-full overflow-y-auto px-4 py-2 focus-visible:outline-none bg-transparent border-0 shadow-none"
          >
            <SummariesSection
              bookmarks={filteredBookmarks}
              selectedBookmarks={selectedBookmarks}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              isGenerating={isGenerating}
              progress={progress}
              summaries={summaries}
              handleGenerateSummaries={handleGenerateSummaries}
              handleClearSummaries={handleClearSummaries}
            />
          </TabsContent>
          
          <TabsContent 
            value="chat"
            className="mt-0 h-full overflow-y-auto px-4 py-2 focus-visible:outline-none bg-transparent border-0 shadow-none"
          >
            <ChatSection
              bookmarks={bookmarks}
              onBookmarkSelect={setSelectedBookmark}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};