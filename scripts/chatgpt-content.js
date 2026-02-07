console.log('🚀 Wormhole AI: ChatGPT Module Loaded');

// --- 1. THE SCRAPER ---
function scrapeChatGPT() {
  const messages = document.querySelectorAll('[data-message-author-role]');
  let chatLog = [];
  messages.forEach((msg) => {
    const role = msg.getAttribute('data-message-author-role');
    const textContainer = msg.querySelector('.prose');
    if (textContainer) {
      chatLog.push({
        role: role === 'assistant' ? 'Assistant' : 'User',
        text: textContainer.innerText.trim(),
      });
    }
  });
  return chatLog;
}

// --- 2. THE INJECTOR ---
function injectChatGPTUI() {
  if (document.getElementById('llm-bridge-ui-container')) return;

  const mainPill = document.querySelector('[data-composer-surface="true"]');

  if (mainPill) {
    const host = document.createElement('div');
    host.id = 'llm-bridge-ui-container';
    mainPill.parentElement.insertBefore(host, mainPill);

    const shadow = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');

    container.style.cssText = `
      display: flex;
      justify-content: flex-start;
      gap: 12px;
      width: 100%;
      margin-bottom: 15px;
      padding-left: 4px;
    `;
    shadow.appendChild(container);

    const createBtn = (text, color, onClick) => {
      const btn = document.createElement('button');
      btn.innerText = text;
      btn.style.cssText = `
        background: ${color}; color: white; border: none;
        padding: 8px 18px; border-radius: 20px; cursor: pointer;
        font-family: -apple-system, system-ui, sans-serif;
        font-weight: 600; font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.1s ease;
      `;
      btn.onmouseover = () => (btn.style.transform = 'scale(1.05)');
      btn.onmouseout = () => (btn.style.transform = 'scale(1)');
      btn.onclick = onClick;
      return btn;
    };

    // Button 1: Capture (With Smart Truncation)
    container.appendChild(
      createBtn('📸 Capture', '#1a73e8', () => {
        let data = scrapeChatGPT();

        // Keep the 1st message (Prompt) and the last 9 messages (Context)
        if (data.length > 10) {
          console.log(
            '📏 Context too large. Teleporting 1st prompt + last 9 messages.',
          );
          data = [data[0], ...data.slice(-9)];
        }

        chrome.runtime.sendMessage(
          { action: 'storeContext', payload: data },
          () => {
            alert(`Captured ${data.length} messages into the Wormhole!`);
          },
        );
      }),
    );

    chrome.storage.local.get(['lastCapturedChat'], (result) => {
      if (result.lastCapturedChat) {
        // Button 2: Paste
        container.appendChild(
          createBtn('📋 Paste', '#34a853', () => {
            pasteToChatGPT(result.lastCapturedChat);
          }),
        );

        // Button 3: Clear
        container.appendChild(
          createBtn('🗑️ Clear', '#d93025', () => {
            chrome.storage.local.remove('lastCapturedChat', () => {
              console.log('🧹 Wormhole cleared!');
              document.getElementById('llm-bridge-ui-container')?.remove();
            });
          }),
        );
      }
    });
  }
}

// --- 3. THE PASTER ---
function pasteToChatGPT(chatHistory) {
  const formattedText =
    chatHistory.map((msg) => `${msg.role}: ${msg.text}`).join('\n\n') +
    '\n\n--- Continue our conversation based on the history above ---';

  const inputField = document.querySelector(
    '#prompt-textarea[contenteditable="true"]',
  );

  if (inputField) {
    inputField.focus();
    document.execCommand('insertText', false, formattedText);
    inputField.dispatchEvent(new Event('input', { bubbles: true }));

    chrome.storage.local.remove('lastCapturedChat', () => {
      console.log('✅ Teleportation complete! Pocket cleared.');
      document.getElementById('llm-bridge-ui-container')?.remove();
    });
  }
}

setInterval(injectChatGPTUI, 2000);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.lastCapturedChat) {
    document.getElementById('llm-bridge-ui-container')?.remove();
    if (changes.lastCapturedChat.newValue) {
      injectChatGPTUI();
    }
  }
});
