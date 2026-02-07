Wormhole AI: Cross-LLM Context Bridge 🌌

Wormhole AI is a lightweight Chrome extension designed to "teleport" conversation context between Gemini, ChatGPT, and Claude instantly. It solves the fragmentation between different LLM platforms by providing a unified "pocket" for your conversation history.

Features

1. One-Click Capture: Scrapes current chat history from Gemini, ChatGPT, or Claude with a single click.

2. Instant Sync: Uses real-time storage listeners to synchronize the "Context Pocket" across all open LLM tabs without needing a page refresh.

3. Universal Paste: Automatically formats captured history and injects it into the target LLM's input field.

4. Auto-Clear Logic: Implements data minimization by automatically clearing stored context after a successful paste.

5. Unified UI: A clean, shadow-DOM-injected interface that aligns perfectly with the native styling of each platform.

Technical Architecture
This project leverages several modern web extension technologies:

1. Manifest V3: Built on the latest Chrome Extension standards for better performance and security.

2. Shadow DOM: Injects the bridge UI without conflicting with the CSS of the parent LLM site.

3. Chrome Storage API: Manages the "Context Pocket" asynchronously across background and content scripts.

4. Mutation Monitoring: Uses intervals and listeners to ensure the UI remains active during dynamic page updates.

Project Structure
WormholeAI/
├── manifest.json # Extension configuration and permissions
├── background.js # Persistent storage management
├── icons/ # Branded PNG assets (16px, 32px, 48px, 128px)
└── scripts/
├── gemini.js # Scraper & injector for Gemini
├── chatgpt.js # Scraper & injector for ChatGPT
└── claude.js # Scraper & injector for Claude

Installation (Developer Mode)

1. Clone this repository to your local machine.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer mode in the top right corner.
4. Click Load unpacked and select the WormholeAI folder.
5. Pin the extension for easy access to the capture indicators.

Smart Truncation Logic
To ensure that teleported conversations stay within the Context Window of free-tier LLM models, Wormhole AI implements a strategic truncation algorithm:

1. Initial Prompt Preservation: The very first message of a thread (which often contains the core instructions or "System Prompt") is always preserved.

2. Sliding Window History: When a conversation exceeds 10 messages, the extension automatically keeps the initial prompt and the 9 most recent messages.

3. Token Budgeting: This approach prevents "input too long" errors while ensuring the AI remains focused on the most relevant conversational flow.

Secure Architecture & AI Risk Mitigation
As a tool designed by a professional in AppSec and AI Risk Assessment, Wormhole AI prioritizes data integrity and security:

1. Data Minimization: By truncating old messages, we reduce the amount of personal or sensitive data being moved between platforms.

2. Local-Only Processing: Truncation happens entirely within the browser's memory before being moved to local storage; no data ever leaves your machine.

3. Consistency Check: Standardizing the capture format across Gemini, ChatGPT, and Claude ensures that no formatting "artifacts" interfere with the destination model's reasoning.
