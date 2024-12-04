import { toast } from "@/components/ui/use-toast";
import { Category } from "@/types/bookmark";
import { Bookmark } from "@/types/bookmark";
import { flattenBookmarkTree } from "@/utils/bookmarkUtils";

export const handleImportBookmarks = async (selectedFolders: string[], setBookmarks: Function, setFilteredBookmarks: Function) => {
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    toast({
      title: "Error",
      description: "Chrome bookmarks API is not available",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Import started",
    description: "Your bookmarks are being imported...",
  });

  try {
    const bookmarkPromises = selectedFolders.map(folderId => 
      new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve, reject) => {
        chrome.bookmarks.getSubTree(folderId, (results) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(results);
        });
      })
    );

    const results = await Promise.all(bookmarkPromises);
    const bookmarkTrees = results.flat();
    
    // Convert Chrome bookmark tree nodes to our Bookmark type
    const processedBookmarks = flattenBookmarkTree(bookmarkTrees).map(bookmark => ({
      ...bookmark,
      category: 'Uncategorized' // Set default category for new bookmarks
    }));
    
    setBookmarks(processedBookmarks);
    setFilteredBookmarks(processedBookmarks);

    toast({
      title: "Import successful",
      description: `Successfully imported ${processedBookmarks.length} bookmarks`,
    });
  } catch (error) {
    toast({
      title: "Import failed",
      description: "Failed to import bookmarks. Please try again.",
      variant: "destructive",
    });
    console.error('Error importing bookmarks:', error);
  }
};

export const handleAddCategory = (category: Category, categories: Category[], setCategories: Function) => {
  setCategories([...categories, category]);
  toast({
    title: "Category added",
    description: `${category.name} has been added to your categories`,
  });
};

export const handleAddAISuggestion = (suggestion: string, categories: Category[], setCategories: Function) => {
  const newCategory: Category = {
    id: Date.now().toString(),
    name: suggestion,
  };
  handleAddCategory(newCategory, categories, setCategories);
};