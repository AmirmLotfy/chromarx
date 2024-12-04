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
    .flat()
    .slice(1); // Keep the first occurrence, mark others as duplicates
};

export const checkBrokenLink = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // This allows checking external URLs
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const findBrokenBookmarks = async (bookmarks: Bookmark[]): Promise<Bookmark[]> => {
  const brokenBookmarks: Bookmark[] = [];
  
  for (const bookmark of bookmarks) {
    try {
      const isWorking = await checkBrokenLink(bookmark.url);
      if (!isWorking) {
        brokenBookmarks.push(bookmark);
      }
    } catch (error) {
      brokenBookmarks.push(bookmark);
    }
  }
  
  return brokenBookmarks;
};