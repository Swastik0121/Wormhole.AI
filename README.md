# 🌌 Wormhole AI

Teleport your AI context across the browser.

Wormhole AI is a lightweight, secure browser extension that allows you to instantly "teleport" conversation context between Gemini, ChatGPT, and Claude. No more manual copy-pasting or losing track of context when switching models to cross-verify AI responses.

## ✨ Key Features

One-Click Teleportation: Seamlessly capture a thread from one LLM and inject it into another.

Real-Time Sync: Uses a global storage listener to update all open tabs instantly—capture in Gemini, and the Paste button appears in Claude immediately.

Auto-Cleanup: Implements an "ephemeral pocket"—data is wiped the moment it's successfully pasted to protect your privacy.

Shadow DOM Injection: A clean, non-intrusive UI that matches the native theme of each AI platform.

## The "Smart Truncation" Engine

One of the biggest challenges when moving data between LLMs is the Context Window Limit. If you move too much data, the destination model might truncate your input or lose its original instructions.

Wormhole AI solves this using a Heuristic Sliding Window:

1. System Prompt Preservation: The algorithm identifies and locks the very first message (the core instruction).

2. Conversation Focus: It captures the 9 most recent messages to maintain the current "state" of the talk.

3. Data Compression: By removing the "middle" of long conversations, we ensure the destination LLM receives the most critical context without hitting token limits.

## Installation

1. Clone the Repo:

```bash
git clone https://github.com/Swastik0121/Wormhole.AI.git
```

2. Open Extensions: Go to chrome://extensions/ in your browser.

3. Developer Mode: Toggle "Developer Mode" in the top-right corner.

4. Load Unpacked: Click "Load Unpacked" and select the WormholeAI folder

## License

[MIT](https://choosealicense.com/licenses/mit/)
