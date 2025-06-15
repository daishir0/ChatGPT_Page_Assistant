// Debug flag
const DEBUG = false;

// Only log if debug is enabled
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// Receive messages from Content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'sendToChatGPT') {
    handleChatGPTRequest(request.prompt, sender.tab.id);
  }
});

// Process to send prompts to ChatGPT
async function handleChatGPTRequest(prompt, originTabId) {
  try {
    debugLog('Processing ChatGPT request...', prompt);
    
    // Find ChatGPT tab
    const chatGPTTabs = await chrome.tabs.query({
      url: ["https://chat.openai.com/*", "https://chatgpt.com/*"]
    });
    
    let chatGPTTab;
    
    if (chatGPTTabs.length > 0) {
      // Use existing ChatGPT tab if available
      chatGPTTab = chatGPTTabs[0];
      debugLog('Using existing ChatGPT tab:', chatGPTTab.id);
      await chrome.tabs.update(chatGPTTab.id, { active: true });
      
      // Send prompt immediately if already loaded
      if (chatGPTTab.status === 'complete') {
        setTimeout(() => {
          debugLog('Sending prompt:', chatGPTTab.id);
          chrome.tabs.sendMessage(chatGPTTab.id, {
            action: 'fillChatGPTInput',
            prompt: prompt
          }).catch(err => {
            if (DEBUG) {
              console.error('Message sending error:', err);
            }
            // Reload and retry
            chrome.tabs.reload(chatGPTTab.id);
            setTimeout(() => {
              chrome.tabs.sendMessage(chatGPTTab.id, {
                action: 'fillChatGPTInput',
                prompt: prompt
              });
            }, 3000);
          });
        }, 1000);
        return;
      }
    } else {
      // Get temporary chat settings and create tab
      chrome.storage.sync.get({ temporaryChat: false }, function(settings) {
        const baseUrl = 'https://chatgpt.com/';
        const chatGPTUrl = settings.temporaryChat ? baseUrl + '?temporary-chat=true' : baseUrl;
        
        debugLog('Creating new ChatGPT tab');
        chrome.tabs.create({
          url: chatGPTUrl,
          active: true
        }).then(tab => {
          chatGPTTab = tab;
        });
      });
    }
    
    // Wait until ChatGPT page is loaded
    const listener = function(tabId, info) {
      if (tabId === chatGPTTab.id && info.status === 'complete') {
        debugLog('ChatGPT page loading complete');
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Wait a bit before sending prompt (reduced from 3 seconds to 1.5 seconds)
        setTimeout(() => {
          debugLog('Sending prompt:', tabId);
          chrome.tabs.sendMessage(tabId, {
            action: 'fillChatGPTInput',
            prompt: prompt
          }).catch(err => {
            if (DEBUG) {
              console.error('Message sending error:', err);
            }
          });
        }, 1500);
      }
    };
    
    chrome.tabs.onUpdated.addListener(listener);
    
    // Timeout setting (remove listener after 30 seconds)
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      debugLog('Timeout: Removing listener');
    }, 30000);
    
  } catch (error) {
    if (DEBUG) {
      console.error('Error handling ChatGPT request:', error);
    }
  }
}

// Process when extension is installed
chrome.runtime.onInstalled.addListener(function() {
  debugLog('ChatGPT Page Assistant installed');
});

// Process when tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Process when ChatGPT page is loaded
  if (changeInfo.status === 'complete' && tab.url && 
      (tab.url.includes('chat.openai.com') || tab.url.includes('chatgpt.com'))) {
    // Additional processing as needed
  }
});