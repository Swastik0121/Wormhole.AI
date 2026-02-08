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

    // --- CUSTOM SHINY BUTTON STYLES (BTN-11) ---
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .container {
        display: flex;
        justify-content: flex-start;
        gap: 15px;
        width: 100%;
        margin-bottom: 15px;
        padding-left: 4px;
      }

      .custom-btn {
        width: 170px;
        height: 42px;
        color: #fff;
        border-radius: 20px;
        padding: 5px 10px;
        font-family: -apple-system, system-ui, sans-serif;
        font-weight: 600;
        font-size: 13px;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        overflow: hidden;
      }

      /* Specific Action Gradients */
      .btn-ingest { background: linear-gradient(0deg, #1a73e8 0%, #4285f4 100%); }
      .btn-manifest { background: linear-gradient(0deg, #34a853 0%, #43a047 100%); }
      .btn-terminate { background: linear-gradient(0deg, #d93025 0%, #ef5350 100%); }

      /* The Shiny Animation Logic (Btn-11) */
      .custom-btn:before {
        position: absolute;
        content: '';
        display: inline-block;
        top: -180px;
        left: 0;
        width: 30px;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        animation: shiny-btn1 3.5s ease-in-out infinite;
      }

      .custom-btn:hover { opacity: .8; }

      .custom-btn:active {
        box-shadow: 4px 4px 6px 0 rgba(255,255,255,.3),
                   -4px -4px 6px 0 rgba(116, 125, 136, .2), 
                   inset -4px -4px 6px 0 rgba(255,255,255,.2),
                   inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
      }

      /* The Dot Styling */
      .dot {
        width: 6px;
        height: 6px;
        background-color: white;
        border-radius: 50%;
        margin-left: 8px;
        box-shadow: 0 0 8px white;
        animation: pulse-dot 2s infinite;
      }

      @keyframes pulse-dot {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }

      @-webkit-keyframes shiny-btn1 {
        0% { -webkit-transform: scale(0) rotate(45deg); opacity: 0; }
        80% { -webkit-transform: scale(0) rotate(45deg); opacity: 0.5; }
        81% { -webkit-transform: scale(4) rotate(45deg); opacity: 1; }
        100% { -webkit-transform: scale(50) rotate(45deg); opacity: 0; }
      }
    `;
    shadow.appendChild(styleTag);

    const container = document.createElement('div');
    container.className = 'container';
    shadow.appendChild(container);

    // Helper to create themed buttons
    const createBtn = (text, className, onClick) => {
      const btn = document.createElement('button');
      btn.className = `custom-btn ${className}`;
      btn.innerHTML = `<span>${text}</span><div class="dot"></div>`;
      btn.onclick = onClick;
      return btn;
    };

    // Button 1: Ingest
    container.appendChild(
      createBtn('🌌 Initiate Ingest', 'btn-ingest', () => {
        let data = scrapeChatGPT();
        if (data.length > 10) data = [data[0], ...data.slice(-9)];
        chrome.runtime.sendMessage(
          { action: 'storeContext', payload: data },
          () => {
            alert('Data successfully pulled into the Singularity!');
          },
        );
      }),
    );

    // Buttons 2 & 3: Manifest & Terminate
    chrome.storage.local.get(['lastCapturedChat'], (result) => {
      if (result.lastCapturedChat) {
        container.appendChild(
          createBtn('🪐 Manifest Context', 'btn-manifest', () => {
            pasteToChatGPT(result.lastCapturedChat);
          }),
        );

        container.appendChild(
          createBtn('🕳️ Terminate Bridge', 'btn-terminate', () => {
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
      document.getElementById('llm-bridge-ui-container')?.remove();
    });
  }
}

setInterval(injectChatGPTUI, 2000);

chrome.storage.onChanged.addListener((changes) => {
  if (changes.lastCapturedChat) {
    document.getElementById('llm-bridge-ui-container')?.remove();
    if (changes.lastCapturedChat.newValue) injectChatGPTUI();
  }
});
