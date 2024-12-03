import { Bookmark } from "@/types/bookmark";

const FOCUS_CATEGORIES = [
  "Work", 
  "Reading", 
  "Development", 
  "Education", 
  "Research",
  "Documentation",
  "Learning"
];

const ENTERTAINMENT_CATEGORIES = [
  "Entertainment", 
  "Social", 
  "Gaming", 
  "Movies", 
  "Music",
  "Videos",
  "Streaming"
];

export const filterFocusBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => {
    // Check category
    const categoryMatch = FOCUS_CATEGORIES.includes(bookmark.category || "Uncategorized");
    
    // Check domain for common work/education domains
    const workDomains = [
      "github.com",
      "gitlab.com",
      "docs.google.com",
      "notion.so",
      "slack.com",
      "trello.com",
      "jira.com",
      "confluence.com",
      "linkedin.com"
    ];
    
    const domain = bookmark.url ? new URL(bookmark.url).hostname : "";
    const domainMatch = workDomains.some(d => domain.includes(d));
    
    return categoryMatch || domainMatch;
  });
};

export const filterEntertainmentBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.filter(bookmark => {
    // Check category
    const categoryMatch = ENTERTAINMENT_CATEGORIES.includes(bookmark.category || "Uncategorized");
    
    // Check domain for common entertainment domains
    const entertainmentDomains = [
      "youtube.com",
      "netflix.com",
      "twitch.tv",
      "spotify.com",
      "reddit.com",
      "instagram.com",
      "tiktok.com",
      "facebook.com",
      "twitter.com"
    ];
    
    const domain = bookmark.url ? new URL(bookmark.url).hostname : "";
    const domainMatch = entertainmentDomains.some(d => domain.includes(d));
    
    return categoryMatch || domainMatch;
  });
};

export const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return "";
  }
};

export const groupBookmarksByDomain = (bookmarks: Bookmark[]): Record<string, Bookmark[]> => {
  return bookmarks.reduce((acc, bookmark) => {
    const domain = getDomainFromUrl(bookmark.url);
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);
};