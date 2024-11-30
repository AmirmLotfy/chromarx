import { Bookmark } from "@/types/bookmark";

export const findDuplicateBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const urlMap = new Map<string, Bookmark[]>();
  
  bookmarks.forEach(bookmark => {
    const url = bookmark.url.toLowerCase().trim();
    if (!urlMap.has(url)) {
      urlMap.set(url, []);
    }
    urlMap.get(url)?.push(bookmark);
  });

  return Array.from(urlMap.values())
    .filter(group => group.length > 1)
    .flat();
};

export const checkBrokenLink = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const findBrokenBookmarks = async (bookmarks: Bookmark[]): Promise<Bookmark[]> => {
  const brokenBookmarks: Bookmark[] = [];
  
  for (const bookmark of bookmarks) {
    const isWorking = await checkBrokenLink(bookmark.url);
    if (!isWorking) {
      brokenBookmarks.push(bookmark);
    }
  }
  
  return brokenBookmarks;
};