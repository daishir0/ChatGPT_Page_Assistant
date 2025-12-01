// Debug flag
const DEBUG = false;

// Default prompt
const DEFAULT_PROMPT = {
  id: 'default',
  title: 'Default Prompt',
  template: `I have a question about text selected from a web page.

**Web Page Information:**
Title: {pageTitle}
URL: {pageUrl}

**Selected Text:**
{selectedText}

**Question:**
{question}

Please answer my question based on the selected text content above.`,
  isDefault: true
};

// Default settings
const DEFAULT_SETTINGS = {
  prompts: [DEFAULT_PROMPT],
  temporaryChat: false,
  requireCtrlKey: true,
  lastUsedPromptId: 'default'
};

// DOM elements
let promptList;
let promptTitleInput;
let promptTemplateTextarea;
let defaultPromptCheckbox;
let temporaryChatCheckbox;
let requireCtrlKeyCheckbox;
let savePromptButton;
let deletePromptButton;
let resetPromptButton;
let addNewPromptButton;
let saveSettingsButton;
let exportSettingsButton;
let importSettingsButton;
let importFileInput;
let saveStatus;
let toggleDebug;

// Currently editing prompt
let currentPromptId = null;

// Initialize the options page
document.addEventListener('DOMContentLoaded', function() {
  if (DEBUG) console.log('Options page loaded');
  
  // Initialize elements
  initializeElements();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load settings
  loadSettings();
});

// Initialize elements
function initializeElements() {
  promptList = document.getElementById('promptList');
  promptTitleInput = document.getElementById('promptTitle');
  promptTemplateTextarea = document.getElementById('promptTemplate');
  defaultPromptCheckbox = document.getElementById('defaultPrompt');
  temporaryChatCheckbox = document.getElementById('temporaryChat');
  requireCtrlKeyCheckbox = document.getElementById('requireCtrlKey');
  savePromptButton = document.getElementById('savePrompt');
  deletePromptButton = document.getElementById('deletePrompt');
  resetPromptButton = document.getElementById('resetPrompt');
  addNewPromptButton = document.getElementById('addNewPrompt');
  saveSettingsButton = document.getElementById('saveSettings');
  exportSettingsButton = document.getElementById('exportSettings');
  importSettingsButton = document.getElementById('importSettings');
  importFileInput = document.getElementById('importFile');
  saveStatus = document.getElementById('saveStatus');
  toggleDebug = document.getElementById('toggleDebug');
  
  // Debug initial state
  if (DEBUG && toggleDebug) {
    toggleDebug.textContent = `Initial checkbox state: ${temporaryChatCheckbox ? 'Found' : 'Not found'}`;
    
    // Add a storage reset button for testing
    const resetStorageBtn = document.createElement('button');
    resetStorageBtn.textContent = 'Reset Storage';
    resetStorageBtn.style.marginTop = '10px';
    resetStorageBtn.style.marginLeft = '10px';
    resetStorageBtn.style.padding = '5px';
    resetStorageBtn.onclick = function() {
      chrome.storage.sync.clear(function() {
        updateDebugInfo('Storage cleared');
        loadSettings();
      });
    };
    toggleDebug.parentNode.appendChild(resetStorageBtn);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Prompt related
  savePromptButton.addEventListener('click', saveCurrentPrompt);
  deletePromptButton.addEventListener('click', deleteCurrentPrompt);
  resetPromptButton.addEventListener('click', resetPromptToDefault);
  addNewPromptButton.addEventListener('click', createNewPrompt);
  
  // Settings related
  saveSettingsButton.addEventListener('click', saveSettings);
  
  // Import/Export related
  exportSettingsButton.addEventListener('click', exportSettings);
  importSettingsButton.addEventListener('click', function() {
    importFileInput.click();
  });
  importFileInput.addEventListener('change', importSettings);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveSettings();
    }
    
    // Escape to close (if opened in popup)
    if (e.key === 'Escape') {
      window.close();
    }
  });
}

// Load settings
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
    if (DEBUG) console.log('Loaded settings from storage:', settings);
    
    // Set default prompts if none exist
    if (!settings.prompts || !Array.isArray(settings.prompts) || settings.prompts.length === 0) {
      settings.prompts = [DEFAULT_PROMPT];
      if (DEBUG) console.log('Using default prompt');
    }
    
    // Update prompt list
    updatePromptList(settings.prompts);
    
    // Set temporary chat mode
    if (temporaryChatCheckbox) {
      temporaryChatCheckbox.checked = settings.temporaryChat;
      if (DEBUG) console.log('Temporary chat mode set to:', temporaryChatCheckbox.checked);
    }

    // Set require Ctrl key mode
    if (requireCtrlKeyCheckbox) {
      requireCtrlKeyCheckbox.checked = settings.requireCtrlKey;
      if (DEBUG) console.log('Require Ctrl key set to:', requireCtrlKeyCheckbox.checked);
    }

    // Select last used prompt or default prompt
    const promptToSelect = settings.lastUsedPromptId || 'default';
    selectPrompt(promptToSelect, settings.prompts);
  });
}

// Update prompt list
function updatePromptList(prompts) {
  // Clear the list
  promptList.innerHTML = '';
  
  // Add prompts to the list
  prompts.forEach(prompt => {
    const li = document.createElement('li');
    li.textContent = prompt.title;
    li.dataset.id = prompt.id;
    
    if (prompt.isDefault) {
      li.classList.add('default');
    }
    
    li.addEventListener('click', function() {
      selectPrompt(prompt.id, prompts);
    });
    
    promptList.appendChild(li);
  });
}

// Select prompt
function selectPrompt(promptId, prompts) {
  // Update current prompt ID
  currentPromptId = promptId;
  
  // Update active state in list
  const items = promptList.querySelectorAll('li');
  items.forEach(item => {
    if (item.dataset.id === promptId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Get selected prompt
  const selectedPrompt = prompts.find(p => p.id === promptId) || DEFAULT_PROMPT;
  
  // Set form values
  promptTitleInput.value = selectedPrompt.title;
  promptTemplateTextarea.value = selectedPrompt.template;
  defaultPromptCheckbox.checked = selectedPrompt.isDefault;
  
  // Update delete button state (default prompt cannot be deleted)
  deletePromptButton.disabled = promptId === 'default';
  
  if (DEBUG) console.log('Selected prompt:', selectedPrompt);
}

// Create new prompt
function createNewPrompt() {
  // Generate new prompt ID
  const newId = 'prompt_' + Date.now();
  
  // Create new prompt object
  const newPrompt = {
    id: newId,
    title: 'New Prompt',
    template: DEFAULT_PROMPT.template,
    isDefault: false
  };
  
  // Get current settings from storage
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
    // Add new prompt to the list
    const updatedPrompts = [...settings.prompts, newPrompt];
    
    // Save to storage
    chrome.storage.sync.set({ prompts: updatedPrompts }, function() {
      if (DEBUG) console.log('Created new prompt:', newPrompt);
      
      // Update prompt list
      updatePromptList(updatedPrompts);
      
      // Select new prompt
      selectPrompt(newId, updatedPrompts);
      
      // Show success message
      showSaveStatus('New prompt created', 'success');
    });
  });
}

// Save current prompt
function saveCurrentPrompt() {
  if (!currentPromptId) return;
  
  // Get values from form
  const title = promptTitleInput.value.trim() || 'Untitled Prompt';
  const template = promptTemplateTextarea.value.trim() || DEFAULT_PROMPT.template;
  const isDefault = defaultPromptCheckbox.checked;
  
  // Get current settings from storage
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
    // Create a copy of the prompt list
    const updatedPrompts = [...settings.prompts];
    
    // Find index of current prompt
    const promptIndex = updatedPrompts.findIndex(p => p.id === currentPromptId);
    
    if (promptIndex !== -1) {
      // Update existing prompt
      updatedPrompts[promptIndex] = {
        ...updatedPrompts[promptIndex],
        title,
        template,
        isDefault
      };
    } else {
      // Add new prompt
      updatedPrompts.push({
        id: currentPromptId,
        title,
        template,
        isDefault
      });
    }
    
    // If default prompt changed, unset default for other prompts
    if (isDefault) {
      updatedPrompts.forEach((p, index) => {
        if (p.id !== currentPromptId) {
          updatedPrompts[index].isDefault = false;
        }
      });
    }
    
    // Save to storage
    chrome.storage.sync.set({ 
      prompts: updatedPrompts,
      lastUsedPromptId: isDefault ? currentPromptId : settings.lastUsedPromptId
    }, function() {
      if (DEBUG) console.log('Saved prompt:', currentPromptId);
      
      // Update prompt list
      updatePromptList(updatedPrompts);
      
      // Re-select current prompt
      selectPrompt(currentPromptId, updatedPrompts);
      
      // Show success message
      showSaveStatus('Prompt saved', 'success');
    });
  });
}

// Delete current prompt
function deleteCurrentPrompt() {
  if (!currentPromptId || currentPromptId === 'default') return;
  
  if (confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
    // Get current settings from storage
    chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
      // Filter out the prompt to delete
      const updatedPrompts = settings.prompts.filter(p => p.id !== currentPromptId);
      
      // Check if a default prompt exists
      const hasDefault = updatedPrompts.some(p => p.isDefault);
      
      // If no default prompt exists, set the first prompt as default
      if (!hasDefault && updatedPrompts.length > 0) {
        updatedPrompts[0].isDefault = true;
      }
      
      // Update last used prompt ID
      let lastUsedPromptId = settings.lastUsedPromptId;
      if (lastUsedPromptId === currentPromptId) {
        // Select default prompt or first prompt
        const defaultPrompt = updatedPrompts.find(p => p.isDefault);
        lastUsedPromptId = defaultPrompt ? defaultPrompt.id : (updatedPrompts[0] ? updatedPrompts[0].id : 'default');
      }
      
      // Save to storage
      chrome.storage.sync.set({ 
        prompts: updatedPrompts,
        lastUsedPromptId
      }, function() {
        if (DEBUG) console.log('Deleted prompt:', currentPromptId);
        
        // Update prompt list
        updatePromptList(updatedPrompts);
        
        // Select new prompt
        selectPrompt(lastUsedPromptId, updatedPrompts);
        
        // Show success message
        showSaveStatus('Prompt deleted', 'success');
      });
    });
  }
}

// Reset prompt to default
function resetPromptToDefault() {
  if (confirm('Are you sure you want to reset the prompt template to default? This will overwrite your current template.')) {
    promptTemplateTextarea.value = DEFAULT_PROMPT.template;
    saveCurrentPrompt();
  }
}

// Save settings
function saveSettings() {
  try {
    // Get temporary chat mode value
    const temporaryChatValue = temporaryChatCheckbox ? temporaryChatCheckbox.checked : DEFAULT_SETTINGS.temporaryChat;
    // Get require Ctrl key value
    const requireCtrlKeyValue = requireCtrlKeyCheckbox ? requireCtrlKeyCheckbox.checked : DEFAULT_SETTINGS.requireCtrlKey;

    // Save current prompt
    saveCurrentPrompt();

    // Save settings
    chrome.storage.sync.set({
      temporaryChat: temporaryChatValue,
      requireCtrlKey: requireCtrlKeyValue
    }, function() {
      if (DEBUG) console.log('Settings saved');
      showSaveStatus('Settings saved successfully!', 'success');
    });
  } catch (error) {
    if (DEBUG) console.error('Error saving settings:', error);
    showSaveStatus('Error: ' + error.message, 'error');
  }
}

// Export settings
function exportSettings() {
  chrome.storage.sync.get(null, function(settings) {
    // Convert settings to JSON string
    const settingsJSON = JSON.stringify(settings, null, 2);
    
    // Create blob
    const blob = new Blob([settingsJSON], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatgpt-page-assistant-settings.json';
    
    // Click link to download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    showSaveStatus('Settings exported successfully', 'success');
  });
}

// Import settings
function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      // Parse JSON
      const settings = JSON.parse(e.target.result);
      
      // Validate settings
      if (!settings || typeof settings !== 'object') {
        throw new Error('Invalid settings file');
      }
      
      // Validate prompts
      if (settings.prompts && Array.isArray(settings.prompts)) {
        // Check if each prompt has required properties
        settings.prompts.forEach(prompt => {
          if (!prompt.id || !prompt.title || !prompt.template) {
            throw new Error('Invalid prompt format');
          }
        });
        
        // Check if a default prompt exists
        const hasDefault = settings.prompts.some(p => p.isDefault);
        if (!hasDefault && settings.prompts.length > 0) {
          settings.prompts[0].isDefault = true;
        }
      } else {
        // Set default prompts if none exist
        settings.prompts = [DEFAULT_PROMPT];
      }
      
      // Validate temporaryChat
      if (typeof settings.temporaryChat !== 'boolean') {
        // Set default temporaryChat if it doesn't exist or is invalid
        settings.temporaryChat = DEFAULT_SETTINGS.temporaryChat;
      }

      // Validate requireCtrlKey
      if (typeof settings.requireCtrlKey !== 'boolean') {
        // Set default requireCtrlKey if it doesn't exist or is invalid
        settings.requireCtrlKey = DEFAULT_SETTINGS.requireCtrlKey;
      }

      // Ensure lastUsedPromptId is valid
      if (!settings.lastUsedPromptId || !settings.prompts.some(p => p.id === settings.lastUsedPromptId)) {
        // Set to default prompt or first prompt
        const defaultPrompt = settings.prompts.find(p => p.isDefault);
        settings.lastUsedPromptId = defaultPrompt ? defaultPrompt.id : settings.prompts[0].id;
      }
      
      // Save to storage
      chrome.storage.sync.set(settings, function() {
        if (DEBUG) console.log('Settings imported:', settings);
        
        // Reload settings
        loadSettings();
        
        // Show success message
        showSaveStatus('Settings imported successfully', 'success');
      });
    } catch (error) {
      if (DEBUG) console.error('Error importing settings:', error);
      showSaveStatus('Error: ' + error.message, 'error');
    }
  };
  
  reader.onerror = function() {
    showSaveStatus('Error reading file', 'error');
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Update debug info
function updateDebugInfo(action) {
  if (DEBUG && toggleDebug) {
    const state = temporaryChatCheckbox ? temporaryChatCheckbox.checked : 'unknown';
    toggleDebug.innerHTML += `<br>Toggle state: ${state} (${action}) at ${new Date().toLocaleTimeString()}`;
    
    // Scroll to bottom of debug info
    toggleDebug.scrollTop = toggleDebug.scrollHeight;
  }
}

// Show save status
function showSaveStatus(message, type) {
  saveStatus.textContent = message;
  saveStatus.className = `save-status ${type}`;
  
  // Clear the message after 3 seconds
  setTimeout(() => {
    saveStatus.textContent = '';
    saveStatus.className = 'save-status';
  }, 3000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl+S or Cmd+S to save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveSettings();
  }
  
  // Escape to close (if opened in popup)
  if (e.key === 'Escape') {
    window.close();
  }
});