import { Bookmark } from "@/types/bookmark";

const FOCUS_CATEGORIES = ["Work", "Reading", "Development", "Education"];
const ENTERTAINMENT_CATEGORIES = ["Entertainment", "Social", "Gaming", "Movies", "Music"];

export const filterFocusBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => 
    FOCUS_CATEGORIES.includes(bookmark.category || "Uncategorized")
  );
};

export const filterEntertainmentBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => 
    ENTERTAINMENT_CATEGORIES.includes(bookmark.category || "Uncategorized")
  );
};