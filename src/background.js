// Background script for Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChroMarx extension installed');
});

// Handle bookmark events with better error handling and data processing
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  try {
    const processedBookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || '',
      dateAdded: bookmark.dateAdded || Date.now(),
      category: 'Uncategorized'
    };
    
    chrome.runtime.sendMessage({ 
      type: 'BOOKMARK_CREATED', 
      bookmark: processedBookmark 
    });
  } catch (error) {
    console.error('Error handling new bookmark:', error);
  }
});

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
  if (request.type === 'IMPORT_BOOKMARKS') {
    chrome.bookmarks.getSubTree(request.folderId, (results) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError });
        return;
      }
      sendResponse({ bookmarks: results });
    });
    return true; // Will respond asynchronously
  }
});