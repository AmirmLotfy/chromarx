import { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { useSummaryGeneration } from "./useSummaryGeneration";

export const useSummaryState = () => {
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  
  const { 
    isGenerating, 
    progress, 
    summaries, 
    handleGenerateSummaries: generateSummaries, 
    handleClearSummaries 
  } = useSummaryGeneration();

  const handleBookmarkSelect = (bookmarkIds: string | string[]) => {
    const newSelected = new Set(selectedBookmarks);
    
    if (Array.isArray(bookmarkIds)) {
      if (bookmarkIds.length === 0) {
        newSelected.clear();
      } else {
        bookmarkIds.forEach(id => newSelected.add(id));
      }
    } else {
      if (newSelected.has(bookmarkIds)) {
        newSelected.delete(bookmarkIds);
      } else {
        newSelected.add(bookmarkIds);
      }
    }
    
    setSelectedBookmarks(newSelected);
  };

  const handleGenerateSummaries = async (bookmarks: Bookmark[]) => {
    await generateSummaries(bookmarks, selectedLanguage);
  };

  return {
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
  };
};