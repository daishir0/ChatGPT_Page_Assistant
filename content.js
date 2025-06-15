// Content script for ChatGPT Text Assistant
// Handle text selection and question dialog functionality

let selectedText = '';
let questionDialog = null;
let floatingButton = null;

// Listen for text selection events
// Debug flag
const DEBUG = false;

// Only log if debug is enabled
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

document.addEventListener('mouseup', function(e) {
  debugLog('Mouse up event detected');
  // Ignore clicks on existing dialog or button
  if (e.target.closest('.chatgpt-question-dialog') || 
      e.target.closest('.chatgpt-floating-button')) {
    return;
  }
  
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0) {
    debugLog('Text selected:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    selectedText = text;
    
    // Get mouse position (end of selection)
    const mousePosition = {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    };
    
    // Show floating button after a short delay
    setTimeout(() => {
      debugLog('Showing floating button');
      showFloatingButton(mousePosition);
    }, 100);
  } else {
    // Remove button and dialog if no text is selected
    removeFloatingButton();
    removeQuestionDialog();
  }
});

// Show floating question button
function showFloatingButton(mousePosition) {
  debugLog('showFloatingButton called with position:', mousePosition);
  // Remove existing button
  removeFloatingButton();
  
  // Create button element
  floatingButton = document.createElement('div');
  floatingButton.className = 'chatgpt-floating-button';
  floatingButton.innerHTML = `
    <button class="ask-button" title="Ask ChatGPT">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 10h8"/>
        <path d="M8 14h6"/>
      </svg>
      Question
    </button>
  `;
  
  // Position button to the right of mouse position
  floatingButton.style.left = Math.min(mousePosition.x + 10, window.innerWidth + window.pageXOffset - 80) + 'px';
  floatingButton.style.top = (mousePosition.y - 35) + 'px';
  
  document.body.appendChild(floatingButton);
  
  // Handle button click
  const askButton = floatingButton.querySelector('.ask-button');
  askButton.addEventListener('click', function(e) {
    debugLog('Question button clicked');
    e.stopPropagation();
    // Show dialog in center of screen (position parameters are ignored in new implementation)
    showQuestionDialog();
    
    // Remove the floating button after clicking to prevent it from being covered
    removeFloatingButton();
  });
}

// Remove floating button
function removeFloatingButton() {
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
}

// Show question dialog
function showQuestionDialog() {
  debugLog('showQuestionDialog called - displaying in center of screen');
  // Remove existing dialog
  removeQuestionDialog();
  
  try {
    // Create dialog element
    questionDialog = document.createElement('div');
    questionDialog.className = 'chatgpt-question-dialog';
    questionDialog.innerHTML = `
      <div class="dialog-header">
        <span>Ask ChatGPT about selected text</span>
        <button class="close-btn">&times;</button>
      </div>
      <div class="dialog-content">
        <div class="selected-text">
          <strong>Selected text:</strong>
          <p>${selectedText.substring(0, 200)}${selectedText.length > 200 ? '...' : ''}</p>
        </div>
        <textarea class="question-input" placeholder="Enter your question..."></textarea>
        <div class="dialog-buttons">
          <button class="cancel-btn">Cancel</button>
          <button class="ask-btn">Ask ChatGPT</button>
        </div>
      </div>
    `;
    
    // Very simple positioning - center in viewport
    // Dialog dimensions
    const dialogWidth = 400;
    const dialogHeight = 300;
    
    // Center in viewport (fixed positioning is relative to viewport)
    const dialogX = Math.floor((window.innerWidth - dialogWidth) / 2);
    const dialogY = Math.floor((window.innerHeight - dialogHeight) / 2);
    
    debugLog('Simple centered position:', dialogX, dialogY);
    
    // Apply styles directly
    questionDialog.style.position = 'fixed';
    questionDialog.style.left = dialogX + 'px';
    questionDialog.style.top = dialogY + 'px';
    questionDialog.style.zIndex = '99999'; // Ensure highest z-index
    questionDialog.style.backgroundColor = 'white';
    questionDialog.style.border = '2px solid #e5e5e5';
    questionDialog.style.borderRadius = '8px';
    questionDialog.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    questionDialog.style.width = '400px';
    questionDialog.style.maxWidth = '90vw';
    questionDialog.style.display = 'block';
    questionDialog.style.opacity = '1';
    questionDialog.style.visibility = 'visible';
    
    // Append to body
    document.body.appendChild(questionDialog);
    debugLog('Dialog appended to body');
    
    // Setup dialog event listeners
    setupDialogEvents();
    
    // Focus on text input
    setTimeout(() => {
      const inputElement = questionDialog.querySelector('.question-input');
      if (inputElement) {
        inputElement.focus();
        debugLog('Focus set on input element');
      }
    }, 100);
  } catch (error) {
    if (DEBUG) {
      console.error('Error creating dialog:', error);
    }
  }
}

// Setup dialog event handlers
function setupDialogEvents() {
  const closeBtn = questionDialog.querySelector('.close-btn');
  const cancelBtn = questionDialog.querySelector('.cancel-btn');
  const askBtn = questionDialog.querySelector('.ask-btn');
  const questionInput = questionDialog.querySelector('.question-input');
  
  closeBtn.addEventListener('click', removeQuestionDialog);
  cancelBtn.addEventListener('click', removeQuestionDialog);
  
  askBtn.addEventListener('click', function() {
    const question = questionInput.value.trim();
    if (question) {
      sendToChatGPT(selectedText, question);
    }
  });
  
  // Submit on Enter (Shift+Enter for new line)
  questionInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const question = questionInput.value.trim();
      if (question) {
        sendToChatGPT(selectedText, question);
      }
    }
  });
  
  // Close dialog when clicking outside is handled at page level
}

// Remove question dialog
function removeQuestionDialog() {
  if (questionDialog) {
    questionDialog.remove();
    questionDialog = null;
  }
}

// Handle page clicks to close button and dialog
document.addEventListener('click', function(e) {
  if (!e.target.closest('.chatgpt-question-dialog') && 
      !e.target.closest('.chatgpt-floating-button')) {
    removeFloatingButton();
    removeQuestionDialog();
  }
});

// Send question to ChatGPT
function sendToChatGPT(selectedText, question) {
  // Create prompt (async)
  createPrompt(selectedText, question).then(prompt => {
    debugLog('Generated prompt:', prompt);
    
    // 新しいタブを開かずに、直接background.jsに処理を委任する
    // background.jsが既存のタブを検索するか、必要に応じて新しいタブを開く
    chrome.runtime.sendMessage({
      action: 'sendToChatGPT',
      prompt: prompt
    });
    
    debugLog('Sent prompt to background script');
  });
  
  removeQuestionDialog();
}

// Create prompt from template
function createPrompt(selectedText, question) {
  const pageTitle = document.title;
  const pageUrl = window.location.href;
  
  // Get prompt template from settings
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      promptTemplate: `I have a question about text selected from a web page.

**Web Page Information:**
Title: {pageTitle}
URL: {pageUrl}

**Selected Text:**
{selectedText}

**Question:**
{question}

Please answer my question based on the selected text content above.`
    }, function(settings) {
      const prompt = settings.promptTemplate
        .replace(/\{pageTitle\}/g, pageTitle)
        .replace(/\{pageUrl\}/g, pageUrl)
        .replace(/\{selectedText\}/g, selectedText)
        .replace(/\{question\}/g, question);
      
      resolve(prompt);
    });
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillChatGPTInput') {
    fillChatGPTTextarea(request.prompt);
  }
});

// Fill ChatGPT textarea with prompt and submit
function fillChatGPTTextarea(prompt) {
  const isChatGPT = window.location.href.includes('chat.openai.com') || 
                   window.location.href.includes('chatgpt.com');
  
  if (!isChatGPT) {
    debugLog('Not a ChatGPT page:', window.location.href);
    return;
  }
  
  debugLog('Starting prompt input on ChatGPT page');
  
  // Wait for page to fully load (reduced delay)
  setTimeout(() => {
    inputPromptToChatGPT(prompt);
  }, 500);
}

function inputPromptToChatGPT(prompt) {
  debugLog('Starting prompt input');
  
  // Try immediate input first
  if (tryInputPrompt(prompt)) {
    return;
  }
  
  // Retry with short intervals if not found
  let attempts = 0;
  const maxAttempts = 10;
  
  const retryInterval = setInterval(() => {
    attempts++;
    debugLog(`Searching for input element... (${attempts}/${maxAttempts})`);
    
    if (tryInputPrompt(prompt) || attempts >= maxAttempts) {
      clearInterval(retryInterval);
      if (attempts >= maxAttempts) {
        if (DEBUG) {
          console.error('Input element not found');
        }
        alert('Failed to auto-input prompt. Please copy and paste the following text manually:\n\n' + prompt);
      }
    }
  }, 200); // Retry every 200ms
}

function tryInputPrompt(prompt) {
  // Find input element
  let inputElement = document.activeElement;
  
  // Search manually if active element is not suitable
  if (!inputElement || 
      (inputElement.tagName !== 'TEXTAREA' && inputElement.contentEditable !== 'true')) {
    
    const selectors = [
      '#prompt-textarea',
      'div.ProseMirror[contenteditable="true"]',
      'div[contenteditable="true"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
        inputElement = element;
        break;
      }
    }
  }
  
  if (!inputElement) {
    return false; // Element not found
  }
  
  debugLog('Input element found:', inputElement);
  
  // Focus on element
  inputElement.focus();
  inputElement.click();
  
  // Input text
  if (inputElement.contentEditable === 'true') {
    inputElement.textContent = prompt;
    
    // Fire events to notify React of changes
    const events = ['input', 'change', 'keyup'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      inputElement.dispatchEvent(event);
    });
    
    debugLog('Prompt input completed');
    
    // Click send button immediately
    // 遅延時間を短くし、より自然な間隔に
    setTimeout(() => {
      clickSendButton();
    }, 300);
    
    return true;
    
  } else if (inputElement.tagName === 'TEXTAREA') {
    inputElement.value = prompt;
    
    const events = ['input', 'change', 'keyup'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      inputElement.dispatchEvent(event);
    });
    
    debugLog('Prompt input completed (textarea)');
    
    // 遅延時間を短くし、より自然な間隔に
    setTimeout(() => {
      clickSendButton();
    }, 300);
    
    return true;
  }
  
  return false;
}

function clickSendButton() {
  debugLog('Attempting to click send button');
  
  // 送信方法を変更：Enterキーを優先的に使用
  const activeEl = document.activeElement;
  if (activeEl &&
      (activeEl.tagName === 'TEXTAREA' || activeEl.contentEditable === 'true')) {
    
    debugLog('Using Enter key on active element:', activeEl);
    
    // Enterキーイベントを送信
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
      composed: true // Shadow DOMを越えてイベントを伝播させる
    });
    
    // イベントをディスパッチ
    activeEl.dispatchEvent(enterEvent);
    
    debugLog('Enter key event dispatched');
    return;
  }
  
  // Enterキーが機能しない場合はボタンを探す
  const sendSelectors = [
    'button[data-testid="send-button"]',
    'button[aria-label*="Send"]',
    'button[aria-label="Send message"]',
    '#composer-submit-button',
    'button.absolute.p-1.rounded-md', // 新しいセレクタを追加
    'form button[type="submit"]' // フォーム送信ボタン
  ];
  
  let sendButton = null;
  
  for (const selector of sendSelectors) {
    const buttons = document.querySelectorAll(selector);
    for (const button of buttons) {
      if (button && !button.disabled &&
          button.offsetWidth > 0 && button.offsetHeight > 0) {
        sendButton = button;
        debugLog('Send button found:', selector, button);
        break;
      }
    }
    if (sendButton) break;
  }
  
  if (sendButton) {
    debugLog('Clicking send button:', sendButton);
    
    // ボタンにフォーカスを設定
    sendButton.focus();
    
    // 自然なユーザーアクションをシミュレート
    // マウスダウンイベント
    const mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    sendButton.dispatchEvent(mousedownEvent);
    
    // 短い遅延後にクリックイベント
    setTimeout(() => {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      sendButton.dispatchEvent(clickEvent);
      
      // マウスアップイベント
      const mouseupEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      sendButton.dispatchEvent(mouseupEvent);
      
      debugLog('Send button events completed');
    }, 50);
  } else {
    debugLog('Send button not found, trying form submission');
    
    // フォーム送信を試みる
    const form = document.querySelector('form');
    if (form) {
      debugLog('Form found, attempting to submit');
      form.submit();
    } else {
      debugLog('No form found, submission failed');
    }
  }
}