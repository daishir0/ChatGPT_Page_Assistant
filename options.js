// Default settings
const DEFAULT_SETTINGS = {
  promptTemplate: `I have a question about text selected from a web page.

**Web Page Information:**
Title: {pageTitle}
URL: {pageUrl}

**Selected Text:**
{selectedText}

**Question:**
{question}

Please answer my question based on the selected text content above.`,
  temporaryChat: false // Default to false to make toggle changes more visible
};

// Debug flag
const DEBUG = false;

// DOM elements
let promptTemplateTextarea;
let temporaryChatCheckbox;
let saveButton;
let resetButton;
let saveStatus;
let toggleDebug;

// Initialize the options page
document.addEventListener('DOMContentLoaded', function() {
  if (DEBUG) console.log('Options page loaded');
  
  // Initialize elements first
  initializeElements();
  
  // Then load settings
  loadSettings();
  
  // Finally setup event listeners
  setupEventListeners();
  
  // Force default prompt template immediately
  promptTemplateTextarea.value = DEFAULT_SETTINGS.promptTemplate;
  
  // Double check prompt template after a delay to ensure it's set
  setTimeout(() => {
    ensurePromptTemplate();
    if (DEBUG) console.log('Double-checking prompt template:', promptTemplateTextarea.value.substring(0, 30) + '...');
    
    // Force a storage check
    checkStorageDirectly();
  }, 500);
});

// Ensure prompt template is set
function ensurePromptTemplate() {
  if (!promptTemplateTextarea.value || promptTemplateTextarea.value.trim() === '') {
    if (DEBUG) console.log('Setting default prompt template');
    promptTemplateTextarea.value = DEFAULT_SETTINGS.promptTemplate;
  }
  
  // Force the textarea to update by triggering events
  const event = new Event('input', { bubbles: true });
  promptTemplateTextarea.dispatchEvent(event);
  
  // Log the current value
  if (DEBUG) console.log('Current prompt template value:', promptTemplateTextarea.value.substring(0, 50) + '...');
  
  // Force a redraw by manipulating the DOM
  const currentHeight = promptTemplateTextarea.style.height;
  promptTemplateTextarea.style.height = (parseInt(currentHeight || '100') + 1) + 'px';
  setTimeout(() => {
    promptTemplateTextarea.style.height = currentHeight;
  }, 10);
}

// Directly check storage for debugging
function checkStorageDirectly() {
  chrome.storage.sync.get(null, function(items) {
    if (DEBUG) console.log('Direct storage check:', items);
    
    if (DEBUG && toggleDebug) {
      toggleDebug.innerHTML += '<br><strong>Storage contents:</strong><br>';
      
      if (items && Object.keys(items).length > 0) {
        for (const [key, value] of Object.entries(items)) {
          let displayValue = value;
          
          // For prompt template, show truncated version
          if (key === 'promptTemplate' && typeof value === 'string') {
            displayValue = value.substring(0, 50) + '...';
          }
          
          toggleDebug.innerHTML += `${key}: ${displayValue}<br>`;
        }
      } else {
        toggleDebug.innerHTML += 'Storage is empty!<br>';
      }
    }
    
    // If prompt template is missing or empty in storage, save the default
    if (!items.promptTemplate || items.promptTemplate.trim() === '') {
      if (DEBUG) console.log('Prompt template missing in storage, saving default');
      chrome.storage.sync.set({ promptTemplate: DEFAULT_SETTINGS.promptTemplate }, function() {
        if (DEBUG) console.log('Default prompt template saved to storage');
      });
    }
  });
}

function initializeElements() {
  promptTemplateTextarea = document.getElementById('promptTemplate');
  temporaryChatCheckbox = document.getElementById('temporaryChat');
  saveButton = document.getElementById('saveSettings');
  resetButton = document.getElementById('resetPrompt');
  saveStatus = document.getElementById('saveStatus');
  toggleDebug = document.getElementById('toggleDebug');
  
  // Debug initial state
  if (DEBUG && toggleDebug) {
    toggleDebug.textContent = `Initial checkbox state: ${temporaryChatCheckbox ? 'Found' : 'Not found'}`;
    
    // Add a manual toggle button for testing
    const manualToggleBtn = document.createElement('button');
    manualToggleBtn.textContent = 'Force Toggle';
    manualToggleBtn.style.marginTop = '10px';
    manualToggleBtn.style.padding = '5px';
    manualToggleBtn.onclick = function() {
      if (temporaryChatCheckbox) {
        temporaryChatCheckbox.checked = !temporaryChatCheckbox.checked;
        updateToggleDebug('manual toggle to ' + temporaryChatCheckbox.checked);
        saveSettings();
      }
    };
    toggleDebug.parentNode.appendChild(manualToggleBtn);
    
    // Add a storage reset button
    const resetStorageBtn = document.createElement('button');
    resetStorageBtn.textContent = 'Reset Storage';
    resetStorageBtn.style.marginTop = '10px';
    resetStorageBtn.style.marginLeft = '10px';
    resetStorageBtn.style.padding = '5px';
    resetStorageBtn.onclick = function() {
      chrome.storage.sync.clear(function() {
        updateToggleDebug('storage cleared');
        loadSettings();
      });
    };
    toggleDebug.parentNode.appendChild(resetStorageBtn);
  }
}

function setupEventListeners() {
  // Save settings
  saveButton.addEventListener('click', saveSettings);
  
  // Reset prompt to default
  resetButton.addEventListener('click', resetPromptToDefault);
  
  // Simple checkbox change event - only update UI, don't save
  if (temporaryChatCheckbox) {
    temporaryChatCheckbox.addEventListener('change', function() {
      if (DEBUG) console.log('Checkbox changed:', this.checked);
      if (DEBUG && toggleDebug) {
        toggleDebug.innerHTML += '<br>Checkbox changed to: ' + this.checked + ' (not saved yet)';
      }
      // No auto-save on checkbox change - user must click Save Settings button
    });
  } else {
    if (DEBUG) console.error('Temporary chat checkbox not found!');
    if (toggleDebug) {
      toggleDebug.textContent = 'ERROR: Checkbox element not found!';
      toggleDebug.style.color = 'red';
    }
  }
  
  // Monitor template changes but don't auto-save
  promptTemplateTextarea.addEventListener('input', function() {
    if (DEBUG) console.log('Template changed, waiting for Save button click');
    // No auto-save on template change - user must click Save Settings button
  });
}

function loadSettings() {
  // First set default values directly
  if (promptTemplateTextarea) {
    promptTemplateTextarea.value = DEFAULT_SETTINGS.promptTemplate;
  }
  
  if (temporaryChatCheckbox) {
    temporaryChatCheckbox.checked = DEFAULT_SETTINGS.temporaryChat;
  }
  
  // Then try to load from storage
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
    if (DEBUG) console.log('Loaded settings from storage:', settings);
    
    // Set prompt template - ensure it's not empty
    if (promptTemplateTextarea) {
      // Force default prompt if empty or undefined
      if (!settings.promptTemplate || settings.promptTemplate.trim() === '') {
        settings.promptTemplate = DEFAULT_SETTINGS.promptTemplate;
        if (DEBUG) console.log('Using default prompt template');
        
        // Save the default prompt immediately
        chrome.storage.sync.set({ promptTemplate: DEFAULT_SETTINGS.promptTemplate }, function() {
          if (DEBUG) console.log('Default prompt template saved to storage');
        });
      }
      
      // Set the value and log it
      promptTemplateTextarea.value = settings.promptTemplate;
      if (DEBUG) console.log('Prompt template set to:', promptTemplateTextarea.value.substring(0, 50) + '...');
      
      // Ensure the prompt is visible by forcing focus and blur
      promptTemplateTextarea.focus();
      promptTemplateTextarea.blur();
      
      // Force a redraw of the textarea
      setTimeout(() => {
        // Trigger input event to ensure any listeners are notified
        const event = new Event('input', { bubbles: true });
        promptTemplateTextarea.dispatchEvent(event);
        
        // Log the value again after redraw
        if (DEBUG) console.log('After redraw, prompt template is:',
          promptTemplateTextarea.value ?
          promptTemplateTextarea.value.substring(0, 50) + '...' :
          'EMPTY!');
      }, 100);
    }
    
    // Set temporary chat checkbox - simple approach
    if (temporaryChatCheckbox) {
      temporaryChatCheckbox.checked = settings.temporaryChat;
      if (DEBUG) console.log('Temporary chat checkbox set to:', temporaryChatCheckbox.checked);
      if (DEBUG && toggleDebug) {
        toggleDebug.innerHTML += '<br>Loaded setting: ' + settings.temporaryChat;
      }
    } else {
      if (DEBUG) console.error('Cannot set checkbox value - element not found');
    }
  });
}

// Update debug info
function updateToggleDebug(action) {
  if (DEBUG && toggleDebug) {
    const state = temporaryChatCheckbox ? temporaryChatCheckbox.checked : 'unknown';
    toggleDebug.innerHTML += `<br>Toggle state: ${state} (${action}) at ${new Date().toLocaleTimeString()}`;
    
    // Scroll to bottom of debug info
    toggleDebug.scrollTop = toggleDebug.scrollHeight;
  }
}

// Update toggle visual state
function updateToggleVisualState(isChecked) {
  const toggleSlider = document.querySelector('.toggle-slider');
  if (toggleSlider) {
    if (DEBUG) console.log('Updating toggle visual state to:', isChecked);
    
    if (isChecked) {
      toggleSlider.classList.add('checked');
      toggleSlider.style.backgroundColor = '#10a37f';
      // Only use CSS custom property - don't try to access pseudo-elements directly
      toggleSlider.style.setProperty('--toggle-position', '30px');
    } else {
      toggleSlider.classList.remove('checked');
      toggleSlider.style.backgroundColor = '#ccc';
      // Only use CSS custom property - don't try to access pseudo-elements directly
      toggleSlider.style.setProperty('--toggle-position', '0');
    }
  }
}

// Force save settings directly
function forceSaveSettings() {
  try {
    const temporaryChatValue = temporaryChatCheckbox ? temporaryChatCheckbox.checked : DEFAULT_SETTINGS.temporaryChat;
    
    if (DEBUG) console.log('Force saving temporaryChat:', temporaryChatValue);
    updateToggleDebug('force saving: ' + temporaryChatValue);
    
    // Update visual state again to be sure
    updateToggleVisualState(temporaryChatValue);
    
    // Save only the temporaryChat setting
    chrome.storage.sync.set({ temporaryChat: temporaryChatValue }, function() {
      if (chrome.runtime.lastError) {
        if (DEBUG) console.error('Error saving temporaryChat:', chrome.runtime.lastError);
        updateToggleDebug('ERROR force saving: ' + chrome.runtime.lastError.message);
      } else {
        if (DEBUG) console.log('temporaryChat saved successfully');
        updateToggleDebug('force saved successfully');
        
        // Verify the save
        setTimeout(() => {
          chrome.storage.sync.get(['temporaryChat'], function(result) {
            if (DEBUG) console.log('Verified temporaryChat value:', result.temporaryChat);
            updateToggleDebug('verified value: ' + result.temporaryChat);
            
            // Update visual state again after verification
            updateToggleVisualState(result.temporaryChat);
          });
        }, 100);
      }
    });
  } catch (error) {
    if (DEBUG) console.error('Exception in forceSaveSettings:', error);
    updateToggleDebug('EXCEPTION in force save: ' + error.message);
  }
}

function saveSettings() {
  try {
    // Get current values
    const promptValue = promptTemplateTextarea.value.trim();
    const temporaryChatValue = temporaryChatCheckbox ? temporaryChatCheckbox.checked : DEFAULT_SETTINGS.temporaryChat;
    
    // Make sure prompt template is not empty
    const finalPromptValue = promptValue || DEFAULT_SETTINGS.promptTemplate;
    
    // Create settings object
    const settings = {
      promptTemplate: finalPromptValue,
      temporaryChat: temporaryChatValue
    };
    
    if (DEBUG) console.log('Saving settings:', settings);
    
    // First save temporaryChat separately to ensure it's saved
    chrome.storage.sync.set({ temporaryChat: temporaryChatValue }, function() {
      if (DEBUG) console.log('temporaryChat saved separately:', temporaryChatValue);
      
      // Then save all settings
      chrome.storage.sync.set(settings, function() {
        if (chrome.runtime.lastError) {
          if (DEBUG) console.error('Error saving settings:', chrome.runtime.lastError);
          showSaveStatus('Error saving settings', 'error');
        } else {
          if (DEBUG) console.log('Settings saved successfully');
          showSaveStatus('Settings saved successfully!', 'success');
          
          // Update the textarea with the saved value
          promptTemplateTextarea.value = finalPromptValue;
          
          // Verify the save
          chrome.storage.sync.get(null, function(items) {
            if (DEBUG) console.log('Verified saved settings:', items);
            if (DEBUG && toggleDebug) {
              toggleDebug.innerHTML += '<br>Saved and verified: ' + JSON.stringify(items);
            }
          });
        }
      });
    });
  } catch (error) {
    if (DEBUG) console.error('Exception in saveSettings:', error);
    showSaveStatus('Error: ' + error.message, 'error');
  }
}

function resetPromptToDefault() {
  if (confirm('Are you sure you want to reset the prompt template to default? This will overwrite your current template.')) {
    promptTemplateTextarea.value = DEFAULT_SETTINGS.promptTemplate;
    saveSettings();
  }
}

function showSaveStatus(message, type) {
  saveStatus.textContent = message;
  saveStatus.className = `save-status ${type}`;
  
  // Clear the message after 3 seconds
  setTimeout(() => {
    saveStatus.textContent = '';
    saveStatus.className = 'save-status';
  }, 3000);
}

// updatePreview function removed

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