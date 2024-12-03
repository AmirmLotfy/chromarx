// Background script for Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChroMarx extension installed');
  // Initialize with dark mode and empty visit data
  chrome.storage.local.set({ 
    theme: 'dark',
    visitCounts: {},
    timeSpent: {}
  });
});

// Track bookmark visits and time
const visitCounts = new Map();
const timeSpent = new Map();
let activeTabStartTime;

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  try {
    const url = new URL(bookmark.url || '');
    const processedBookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || '',
      dateAdded: bookmark.dateAdded || Date.now(),
      category: 'Uncategorized',
      visitCount: 0,
      domain: url.hostname
    };
    
    chrome.runtime.sendMessage({ 
      type: 'BOOKMARK_CREATED', 
      bookmark: processedBookmark 
    });
  } catch (error) {
    console.error('Error handling new bookmark:', error);
  }
});

// Track active tab time
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabStartTime = Date.now();
});

// Track bookmark visits and update time spent
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;

      chrome.bookmarks.search({ url: tab.url }, (bookmarks) => {
        if (bookmarks.length > 0) {
          const bookmarkId = bookmarks[0].id;
          const currentCount = visitCounts.get(bookmarkId) || 0;
          visitCounts.set(bookmarkId, currentCount + 1);
          
          // Update storage with new visit count
          chrome.storage.local.get('visitCounts', (data) => {
            const counts = data.visitCounts || {};
            counts[bookmarkId] = currentCount + 1;
            chrome.storage.local.set({ visitCounts: counts });
          });

          // Track time spent on domain
          const currentTime = timeSpent.get(domain) || 0;
          if (activeTabStartTime) {
            const timeElapsed = Date.now() - activeTabStartTime;
            timeSpent.set(domain, currentTime + timeElapsed);
            
            // Update storage with time spent
            chrome.storage.local.get('timeSpent', (data) => {
              const times = data.timeSpent || {};
              times[domain] = (times[domain] || 0) + timeElapsed;
              chrome.storage.local.set({ timeSpent: times });
            });
          }
          
          chrome.runtime.sendMessage({
            type: 'BOOKMARK_VISITED',
            bookmarkId,
            visitCount: currentCount + 1,
            domain,
            timeSpent: timeSpent.get(domain)
          });
        }
      });
    } catch (error) {
      console.error('Error tracking bookmark visit:', error);
    }
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
  
  if (request.type === 'GET_TIME_SPENT') {
    sendResponse({ timeSpent: timeSpent.get(request.domain) || 0 });
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