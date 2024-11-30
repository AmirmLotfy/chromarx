import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import { sampleBookmarks } from "@/data/sampleBookmarks";
import { flattenBookmarkTree, sortBookmarks } from "@/utils/bookmarkUtils";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Header } from "@/components/Header";
import { ChatSection } from "@/components/sections/ChatSection";
import { BookmarksSection } from "@/components/sections/BookmarksSection";
import { Footer } from "@/components/Footer";
import { useSummaryState } from "@/hooks/useSummaryState";

export const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [folders, setFolders] = useState<any[]>([]);
  const [aiPrompts, setAiPrompts] = useState({
    summary: "You are a summarization assistant. Provide a brief, clear summary in 2-3 sentences.",
    category: "You are a bookmark categorization assistant. Suggest a single category from these options: Work, Personal, Shopping, Reading, Entertainment, Social, News, Development, Education, or Other. Only return the category name, nothing else.",
  });
  
  const [settings, setSettings] = useState({
    enableAI: true,
    showSummaries: true,
    privacyMode: false,
  });

  const { toast } = useToast();
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
    handleGenerateSummaries,
    handleClearSummaries 
  } = useSummaryState();

  const loadBookmarks = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          const flattenedBookmarks = flattenBookmarkTree(bookmarkTreeNodes);
          setBookmarks(flattenedBookmarks);
          setFilteredBookmarks(flattenedBookmarks);
          setFolders(bookmarkTreeNodes);
        });
      } else {
        setBookmarks(sampleBookmarks);
        setFilteredBookmarks(sampleBookmarks);
      }
    } catch (error) {
      toast({
        title: "Error loading bookmarks",
        description: "Failed to load bookmarks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    loadBookmarks();
  };

  const handleUpdateAIPrompt = (type: "summary" | "category", prompt: string) => {
    setAiPrompts(prev => ({
      ...prev,
      [type]: prompt
    }));
  };

  const handleSort = (type: string) => {
    const sorted = sortBookmarks(filteredBookmarks, type);
    setFilteredBookmarks(sorted);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredBookmarks(bookmarks);
    } else {
      const filtered = bookmarks.filter((bookmark) => bookmark.category === category);
      setFilteredBookmarks(filtered);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBookmarks(filtered);
  };

  const handleCategoryUpdate = (bookmarkId: string, category: string) => {
    const updatedBookmarks = bookmarks.map(bookmark =>
      bookmark.id === bookmarkId ? { ...bookmark, category } : bookmark
    );
    setBookmarks(updatedBookmarks);
    setFilteredBookmarks(updatedBookmarks);
    
    toast({
      title: "Category Updated",
      description: `Bookmark category has been updated to ${category}`,
    });
  };

  const handleBookmarksRemoved = (removedIds: string[]) => {
    const updatedBookmarks = bookmarks.filter(b => !removedIds.includes(b.id));
    setBookmarks(updatedBookmarks);
    setFilteredBookmarks(updatedBookmarks);
    
    toast({
      title: "Bookmarks Removed",
      description: `Successfully removed ${removedIds.length} bookmark(s)`,
    });
  };

  const handleAddCategory = (category: { id: string; name: string; isAISuggested?: boolean }) => {
    toast({
      title: "Category Added",
      description: `Added new category: ${category.name}`,
    });
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleDeleteCategory = (categoryId: string) => {
    toast({
      title: "Category Deleted",
      description: `Successfully deleted category`,
    });
  };

  return (
    <MainLayout>
      <Header 
        folders={folders}
        setBookmarks={setBookmarks}
        setFilteredBookmarks={setFilteredBookmarks}
        onSettingsChange={setSettings}
        settings={settings}
        aiPrompts={aiPrompts}
        handleUpdateAIPrompt={handleUpdateAIPrompt}
        bookmarks={bookmarks}
      />
      
      <ChatSection
        bookmarks={filteredBookmarks}
        onBookmarkSelect={setSelectedBookmark}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      
      <BookmarksSection
        filteredBookmarks={filteredBookmarks}
        selectedBookmark={selectedBookmark}
        selectedBookmarks={selectedBookmarks}
        selectedCategory={selectedCategory}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onSort={handleSort}
        setSelectedBookmark={setSelectedBookmark}
        handleBookmarkSelect={handleBookmarkSelect}
        handleCategoryUpdate={handleCategoryUpdate}
        handleGenerateSummaries={handleGenerateSummaries}
        settings={settings}
        isGenerating={isGenerating}
        progress={progress}
        onBookmarksRemoved={handleBookmarksRemoved}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onRefresh={handleRefresh}
        onClearSummaries={handleClearSummaries}
        summaries={summaries}
      />
      
      <Footer />
    </MainLayout>
  );
};
