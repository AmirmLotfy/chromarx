// Background script for Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChroMarx extension installed');
  
  // Initialize storage with default values
  chrome.storage.sync.set({
    settings: {
      enableAI: true,
      showSummaries: true,
      privacyMode: false,
      syncEnabled: true
    }
  });
});

// Handle bookmark events
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('New bookmark created:', bookmark);
  try {
    const processedBookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || '',
      dateAdded: bookmark.dateAdded || Date.now(),
      category: 'Uncategorized'
    };
    
    chrome.storage.local.get(['bookmarks'], (result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(processedBookmark);
      chrome.storage.local.set({ bookmarks });
    });
  } catch (error) {
    console.error('Error handling new bookmark:', error);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.type === 'GET_BOOKMARK_FOLDERS') {
    console.log('Fetching bookmark folders');
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      if (chrome.runtime.lastError) {
        console.error('Error fetching bookmarks:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError });
        return;
      }

      const extractFolders = (nodes, path = '') => {
        return nodes.reduce((folders, node) => {
          if (!node.url) { // It's a folder
            const currentPath = path ? `${path} > ${node.title}` : node.title;
            folders.push({
              id: node.id,
              title: node.title,
              path: currentPath,
              children: node.children ? extractFolders(node.children, currentPath) : []
            });
          }
          return folders;
        }, []);
      };

      const folders = extractFolders(bookmarkTreeNodes);
      console.log('Extracted folders:', folders);
      sendResponse({ folders });
    });
    return true; // Required for async response
  }

  if (request.type === 'IMPORT_BOOKMARKS') {
    console.log('Starting bookmark import for folders:', request.folderIds);
    
    const processBookmarks = (nodes) => {
      return nodes.flatMap(node => {
        if (node.url) {
          return [{
            id: node.id,
            title: node.title,
            url: node.url,
            dateAdded: node.dateAdded || Date.now(),
            category: 'Uncategorized',
            visits: 0
          }];
        }
        return node.children ? processBookmarks(node.children) : [];
      });
    };

    Promise.all(request.folderIds.map(folderId => 
      new Promise((resolve, reject) => {
        chrome.bookmarks.getSubTree(folderId, (results) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(results);
        });
      })
    ))
    .then(results => {
      const processedBookmarks = results.flatMap(result => processBookmarks(result));
      console.log('Processed bookmarks:', processedBookmarks);

      chrome.storage.local.set({ bookmarks: processedBookmarks }, () => {
        if (chrome.runtime.lastError) {
          console.error('Storage error:', chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError });
        } else {
          console.log('Bookmarks saved successfully');
          sendResponse({ success: true, bookmarks: processedBookmarks });
        }
      });
    })
    .catch(error => {
      console.error('Import error:', error);
      sendResponse({ error });
    });

    return true; // Required for async response
  }
});