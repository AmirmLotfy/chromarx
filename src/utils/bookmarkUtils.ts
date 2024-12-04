import { Bookmark } from "@/types/bookmark";

export interface BookmarkFolder {
  id: string;
  title: string;
  children?: (BookmarkFolder | Bookmark)[];
  path?: string;  // Added this property to fix the TypeScript error
}

export const getBookmarkTree = async (): Promise<BookmarkFolder[]> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      try {
        chrome.bookmarks.getTree((tree) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(tree as BookmarkFolder[]);
        });
      } catch (error) {
        reject(error);
      }
    } else {
      // Development fallback
      resolve([{
        id: "1",
        title: "Bookmarks Bar",
        children: []
      }]);
    }
  });
};

export const flattenBookmarkTree = (nodes: chrome.bookmarks.BookmarkTreeNode[]): Bookmark[] => {
  const bookmarks: Bookmark[] = [];
  
  const traverse = (node: chrome.bookmarks.BookmarkTreeNode) => {
    if (node.url) {
      bookmarks.push({
        id: node.id,
        title: node.title,
        url: node.url,
        dateAdded: node.dateAdded || Date.now(),
        category: "Uncategorized",
        parentId: node.parentId
      });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  
  nodes.forEach(traverse);
  return bookmarks;
};

export const sortBookmarks = (bookmarks: Bookmark[], type: string): Bookmark[] => {
  const sorted = [...bookmarks];
  if (type === "date") {
    sorted.sort((a, b) => b.dateAdded - a.dateAdded);
  } else if (type === "alpha") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sorted;
};

export const isChromeBookmarksAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && 
         typeof chrome.bookmarks !== 'undefined' && 
         typeof chrome.runtime !== 'undefined';
};