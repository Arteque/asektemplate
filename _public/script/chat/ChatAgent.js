/**
 * Main Chat Agent Module
 * Orchestrates all chat functionality and manages the overall chat experience
 */

import { ChatUI } from "./ChatUI.js";
import { ChatBot } from "./ChatBot.js";
import { ChatStorage } from "./ChatStorage.js";
import { ChatConfig } from "./ChatConfig.js";

export class ChatAgent {
  constructor(container) {
    this.container = container;
    this.config = ChatConfig;
    this.messages = [];
    this.isInitialized = false;

    // Initialize modules
    this.ui = null;
    this.bot = null;
    this.storage = null;

    this.init();
  }

  /**
   * Initialize the chat agent
   */
  async init() {
    try {
      // Initialize modules
      this.storage = new ChatStorage();
      this.bot = new ChatBot();
      this.ui = new ChatUI(this.container);

      // Load chat history
      await this.loadChatHistory();

      // Show welcome message if no history exists
      if (this.messages.length === 0) {
        this.showWelcomeMessage();
      }

      // Setup event listeners
      this.setupEventListeners();

      // Mark as initialized
      this.isInitialized = true;

      console.log("🤖 Chat Agent initialized successfully");

      // Dispatch ready event
      this.dispatchEvent("ready");
    } catch (error) {
      console.error("❌ Failed to initialize Chat Agent:", error);
      this.handleError("Initialization failed", error);
    }
  }

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    // User message events
    this.container.addEventListener("chat:message", (e) => {
      this.handleUserMessage(e.detail.message);
    });

    // Quick reply events
    this.container.addEventListener("chat:quickReply", (e) => {
      this.handleUserMessage(e.detail.reply);
    });

    // UI state events
    this.container.addEventListener("chat:open", () => {
      this.handleChatOpen();
    });

    this.container.addEventListener("chat:close", () => {
      this.handleChatClose();
    });

    this.container.addEventListener("chat:minimize", () => {
      this.handleChatMinimize();
    });

    // Typing events
    this.container.addEventListener("chat:typing", () => {
      this.handleUserTyping();
    });
  }

  /**
   * Handle user message input
   * @param {string} message - User message text
   */
  async handleUserMessage(message) {
    if (!message || !message.trim()) return;

    try {
      // Add user message to chat
      const userMessage = {
        text: message,
        type: "user",
        timestamp: Date.now(),
      };

      this.addMessage(userMessage);

      // Show typing indicator
      this.ui.showTyping();

      // Process message with bot
      if (this.config.bot.typingDelay > 0) {
        await this.bot.simulateTyping();
      }

      // Generate bot response
      const botResponse = await this.bot.processMessage(message);

      // Hide typing indicator
      this.ui.hideTyping();

      // Add bot response to chat
      this.addMessage(botResponse);

      // Save chat history
      this.saveChatHistory();
    } catch (error) {
      console.error("❌ Error handling user message:", error);
      this.handleError("Failed to process message", error);
    }
  }

  /**
   * Add message to chat
   * @param {Object} message - Message object
   */
  addMessage(message) {
    // Add to messages array
    this.messages.push(message);

    // Add to UI
    this.ui.addMessage(message);

    // Limit message history in memory
    if (this.messages.length > this.config.ui.maxMessagesDisplay) {
      this.messages = this.messages.slice(-this.config.ui.maxMessagesDisplay);
    }

    // Dispatch message event
    this.dispatchEvent("messageAdded", { message });
  }

  /**
   * Handle chat window opening
   */
  handleChatOpen() {
    // Track analytics (if needed)
    this.trackEvent("chat_opened");
  }

  /**
   * Handle chat window closing
   */
  handleChatClose() {
    // Save current state
    this.saveChatHistory();

    // Track analytics
    this.trackEvent("chat_closed");
  }

  /**
   * Handle chat window minimizing
   */
  handleChatMinimize() {
    // Track analytics
    this.trackEvent("chat_minimized");
  }

  /**
   * Handle user typing
   */
  handleUserTyping() {
    // Could be used for analytics or real-time features
    this.trackEvent("user_typing");
  }

  /**
   * Show welcome message with quick replies
   */
  showWelcomeMessage() {
    if (this.config.features.quickReplies && this.config.quickReplies) {
      const welcomeWithQuickReplies = {
        text: this.config.bot.welcomeMessage,
        type: "bot",
        timestamp: Date.now(),
        quickReplies: this.config.quickReplies.map((qr) => qr.text),
      };

      this.addMessage(welcomeWithQuickReplies);
    }
  }

  /**
   * Load chat history from storage
   */
  async loadChatHistory() {
    try {
      const history = this.storage.loadHistory();

      // Restore messages to UI (but not the welcome message)
      if (history.length > 0) {
        this.messages = history;

        // Add messages to UI
        history.forEach((message) => {
          this.ui.addMessage(message);
        });

        // Show notification if chat is closed
        if (!this.ui.isOpen && history.length > 0) {
          this.ui.showNotification();
        }
      }
    } catch (error) {
      console.error("❌ Failed to load chat history:", error);
    }
  }

  /**
   * Save chat history to storage
   */
  saveChatHistory() {
    try {
      this.storage.saveHistory(this.messages);
    } catch (error) {
      console.error("❌ Failed to save chat history:", error);
    }
  }

  /**
   * Clear chat history
   */
  clearHistory() {
    try {
      // Clear from storage
      this.storage.clearHistory();

      // Clear from memory
      this.messages = [];

      // Clear from UI
      this.ui.clearMessages();

      // Reset bot context
      this.bot.resetContext();

      // Show welcome message
      this.showWelcomeMessage();

      this.dispatchEvent("historyCleared");
    } catch (error) {
      console.error("❌ Failed to clear chat history:", error);
      this.handleError("Failed to clear history", error);
    }
  }

  /**
   * Handle errors gracefully
   * @param {string} userMessage - User-friendly error message
   * @param {Error} error - The actual error object
   */
  handleError(userMessage, error) {
    console.error("Chat Agent Error:", error);

    // Hide typing indicator if showing
    this.ui.hideTyping();

    // Show error message to user
    const errorMessage = {
      text: `Désolé, une erreur s'est produite. ${userMessage}. Veuillez réessayer.`,
      type: "bot",
      timestamp: Date.now(),
      isError: true,
    };

    this.addMessage(errorMessage);

    // Dispatch error event
    this.dispatchEvent("error", { error, userMessage });
  }

  /**
   * Get chat statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const storageStats = this.storage.getStats();
    const botInfo = this.bot.getBotInfo();

    return {
      messages: {
        total: this.messages.length,
        user: this.messages.filter((m) => m.type === "user").length,
        bot: this.messages.filter((m) => m.type === "bot").length,
      },
      session: {
        isOpen: this.ui.isOpen,
        isMinimized: this.ui.isMinimized,
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
      },
      storage: storageStats,
      bot: botInfo,
      version: "1.0.0",
    };
  }

  /**
   * Track events (for analytics)
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   */
  trackEvent(eventName, properties = {}) {
    // Implement your analytics tracking here
    // Example: Google Analytics, Adobe Analytics, etc.

    if (typeof gtag !== "undefined") {
      gtag("event", eventName, {
        event_category: "Chat",
        ...properties,
      });
    }

    // Console log for development
    if (this.config.debug) {
      console.log(`📊 Event: ${eventName}`, properties);
    }
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration object
   */
  updateConfig(newConfig) {
    // Deep merge configurations
    this.config = this.deepMerge(this.config, newConfig);

    // Apply changes to modules
    if (newConfig.ui) {
      this.ui.applyTheme();
    }

    if (newConfig.bot) {
      this.bot.config = { ...this.bot.config, ...newConfig.bot };
    }

    this.dispatchEvent("configUpdated", { config: this.config });
  }

  /**
   * Deep merge objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Dispatch custom event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`chatAgent:${eventName}`, {
      detail: {
        ...detail,
        agent: this,
        timestamp: Date.now(),
      },
    });
    this.container.dispatchEvent(event);
  }

  /**
   * Destroy the chat agent
   */
  destroy() {
    try {
      // Save final state
      this.saveChatHistory();

      // Destroy UI
      if (this.ui) {
        this.ui.destroy();
      }

      // Clear references
      this.ui = null;
      this.bot = null;
      this.storage = null;
      this.messages = [];

      // Mark as not initialized
      this.isInitialized = false;

      this.dispatchEvent("destroyed");
    } catch (error) {
      console.error("❌ Error destroying chat agent:", error);
    }
  }

  /**
   * Check if chat agent is ready
   * @returns {boolean} Ready state
   */
  isReady() {
    return this.isInitialized && this.ui && this.bot && this.storage;
  }

  /**
   * Send message programmatically
   * @param {string} message - Message to send
   */
  sendMessage(message) {
    if (this.isReady()) {
      this.handleUserMessage(message);
    } else {
      console.warn("Chat agent not ready. Cannot send message.");
    }
  }

  /**
   * Open chat programmatically
   */
  openChat() {
    if (this.ui) {
      this.ui.openChat();
    }
  }

  /**
   * Close chat programmatically
   */
  closeChat() {
    if (this.ui) {
      this.ui.closeChat();
    }
  }
}

export default ChatAgent;
