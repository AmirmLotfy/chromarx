// Background script for Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChroMarx extension installed');
  // Initialize with dark mode
  chrome.storage.local.set({ theme: 'dark' });
});

// Track bookmark visits
const visitCounts = new Map();

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  try {
    const processedBookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || '',
      dateAdded: bookmark.dateAdded || Date.now(),
      category: 'Uncategorized',
      visitCount: 0
    };
    
    chrome.runtime.sendMessage({ 
      type: 'BOOKMARK_CREATED', 
      bookmark: processedBookmark 
    });
  } catch (error) {
    console.error('Error handling new bookmark:', error);
  }
});

// Track bookmark visits
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.bookmarks.search({ url: tab.url }, (bookmarks) => {
      if (bookmarks.length > 0) {
        const bookmarkId = bookmarks[0].id;
        const currentCount = visitCounts.get(bookmarkId) || 0;
        visitCounts.set(bookmarkId, currentCount + 1);
        
        chrome.runtime.sendMessage({
          type: 'BOOKMARK_VISITED',
          bookmarkId,
          visitCount: currentCount + 1
        });
      }
    });
  }
});

// Track bookmark removal
chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  try {
    chrome.runtime.sendMessage({ 
      type: 'BOOKMARK_REMOVED', 
      id,
      removeInfo 
    });
  } catch (error) {
    console.error('Error handling bookmark removal:', error);
  }
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  try {
    chrome.runtime.sendMessage({ 
      type: 'BOOKMARK_CHANGED', 
      id, 
      changeInfo 
    });
  } catch (error) {
    console.error('Error handling bookmark change:', error);
  }
});

// Add a message listener to handle bookmark operations
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_VISIT_COUNT') {
    sendResponse({ visitCount: visitCounts.get(request.bookmarkId) || 0 });
    return true;
  }
  
  if (request.type === 'IMPORT_BOOKMARKS') {
    chrome.bookmarks.getSubTree(request.folderId, (results) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError });
        return;
      }
      sendResponse({ bookmarks: results });
    });
    return true;
  }
});
