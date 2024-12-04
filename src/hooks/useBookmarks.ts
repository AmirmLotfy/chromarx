import { useState, useEffect, useCallback } from "react";
import { Bookmark, Category } from "@/types/bookmark";
import { sampleBookmarks } from "@/data/sampleBookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load initial bookmarks from storage
  useEffect(() => {
    console.log('Loading initial bookmarks from storage');
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['bookmarks'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading bookmarks:', chrome.runtime.lastError);
          return;
        }
        
        console.log('Loaded bookmarks from storage:', result.bookmarks);
        if (result.bookmarks && result.bookmarks.length > 0) {
          setBookmarks(result.bookmarks);
          setFilteredBookmarks(result.bookmarks);
          
          // Update categories based on loaded bookmarks
          const uniqueCategories = Array.from(new Set(result.bookmarks.map((b: Bookmark) => b.category))) as string[];
          setCategories(uniqueCategories.map(name => ({
            id: name.toLowerCase(),
            name,
            isAISuggested: false
          })));
        } else {
          console.log('No bookmarks in storage, using sample bookmarks');
          setBookmarks(sampleBookmarks);
          setFilteredBookmarks(sampleBookmarks);
          
          // Initialize categories from sample bookmarks
          const uniqueCategories = Array.from(new Set(sampleBookmarks.map(b => b.category)));
          setCategories(uniqueCategories.map(name => ({
            id: name.toLowerCase(),
            name,
            isAISuggested: false
          })));
        }
      });
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
        console.log('Storage changed:', changes, 'in area:', areaName);
        if (areaName === 'local' && changes.bookmarks) {
          console.log('Bookmarks updated in storage:', changes.bookmarks.newValue);
          setBookmarks(changes.bookmarks.newValue);
          setFilteredBookmarks(changes.bookmarks.newValue);
          
          // Update categories based on new bookmarks
          const uniqueCategories = Array.from(new Set(changes.bookmarks.newValue.map((b: Bookmark) => b.category))) as string[];
          setCategories(uniqueCategories.map(name => ({
            id: name.toLowerCase(),
            name,
            isAISuggested: false
          })));
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  const filterBookmarks = useCallback((query: string, category: string) => {
    let filtered = [...bookmarks];

    if (query) {
      const searchTerms = query.toLowerCase().split(" ");
      filtered = filtered.filter(bookmark =>
        searchTerms.every(term =>
          bookmark.title.toLowerCase().includes(term) ||
          bookmark.url.toLowerCase().includes(term) ||
          bookmark.category.toLowerCase().includes(term) ||
          bookmark.tags?.some(tag => tag.toLowerCase().includes(term))
        )
      );
    }

    if (category && category !== "all") {
      filtered = filtered.filter(bookmark => bookmark.category === category);
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks]);

  const handleCategoryUpdate = (bookmarkId: string, category: string) => {
    const updatedBookmarks = bookmarks.map(bookmark =>
      bookmark.id === bookmarkId ? { ...bookmark, category } : bookmark
    );
    setBookmarks(updatedBookmarks);
    setFilteredBookmarks(updatedBookmarks);
    
    // Update storage when categories change
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ bookmarks: updatedBookmarks });
    }
  };

  const handleBookmarksRemoved = (bookmarkIds: string[]) => {
    const updatedBookmarks = bookmarks.filter(bookmark => !bookmarkIds.includes(bookmark.id));
    setBookmarks(updatedBookmarks);
    setFilteredBookmarks(updatedBookmarks);
    
    // Update storage when bookmarks are removed
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ bookmarks: updatedBookmarks });
    }
  };

  const onAddCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const onDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const onRefresh = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['bookmarks'], (result) => {
        if (result.bookmarks && result.bookmarks.length > 0) {
          setBookmarks(result.bookmarks);
          setFilteredBookmarks(result.bookmarks);
        } else {
          setBookmarks(sampleBookmarks);
          setFilteredBookmarks(sampleBookmarks);
        }
      });
    }
  };

  return {
    bookmarks,
    filteredBookmarks,
    handleCategoryUpdate,
    handleBookmarksRemoved,
    onAddCategory,
    onDeleteCategory,
    onRefresh,
    categories,
    filterBookmarks
  };
};