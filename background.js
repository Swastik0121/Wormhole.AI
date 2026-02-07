// Listen for messages from content scripts (Gemini, ChatGPT, etc.)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeContext') {
    console.log('📥 Background received data from:', sender.tab.url);

    // Save the chat history to local storage
    chrome.storage.local.set({ lastCapturedChat: request.payload }, () => {
      console.log('✅ Chat context saved to storage!');
      console.log('Preview of data:', request.payload);
    });

    // Tell the content script everything went okay
    sendResponse({ status: 'success' });
  }
});
