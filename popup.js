document.addEventListener('DOMContentLoaded', function() {
  const openChatGPTButton = document.getElementById('openChatGPT');
  
  // Add settings button if it doesn't exist
  let openSettingsButton = document.getElementById('openSettings');
  if (!openSettingsButton && chrome.runtime.openOptionsPage) {
    // Create settings button
    openSettingsButton = document.createElement('button');
    openSettingsButton.id = 'openSettings';
    openSettingsButton.textContent = 'Settings';
    openSettingsButton.style.marginTop = '10px';
    openSettingsButton.style.backgroundColor = '#f0f0f0';
    openSettingsButton.style.color = '#333';
    document.body.appendChild(openSettingsButton);
  }

  // Open ChatGPT button click handler
  openChatGPTButton.addEventListener('click', function() {
    // Get temporary chat setting
    chrome.storage.sync.get({ temporaryChat: false }, function(settings) {
      const baseUrl = 'https://chatgpt.com/';
      const chatGPTUrl = settings.temporaryChat ? baseUrl + '?temporary-chat=true' : baseUrl;
      
      chrome.tabs.create({
        url: chatGPTUrl,
        active: true
      });
      window.close();
    });
  });
  
  // Open settings button click handler
  if (openSettingsButton) {
    openSettingsButton.addEventListener('click', function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    });
  }
});