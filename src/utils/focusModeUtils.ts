import { Bookmark } from "@/types/bookmark";

const FOCUS_CATEGORIES = ["Work", "Reading", "Development", "Education"];
const ENTERTAINMENT_CATEGORIES = ["Entertainment", "Social", "Gaming", "Movies", "Music"];

export const filterFocusBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => {
    const category = bookmark.category || "Uncategorized";
    return FOCUS_CATEGORIES.includes(category) || 
           category.toLowerCase().includes("work") ||
           category.toLowerCase().includes("study") ||
           category.toLowerCase().includes("learn");
  });
};

export const filterEntertainmentBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => {
    const category = bookmark.category || "Uncategorized";
    return ENTERTAINMENT_CATEGORIES.includes(category) ||
           category.toLowerCase().includes("fun") ||
           category.toLowerCase().includes("game") ||
           category.toLowerCase().includes("entertainment");
  });
};