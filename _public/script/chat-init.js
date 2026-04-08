/**
 * Chat Widget Initialization
 * Main entry point for the chat agent system
 */

import { ChatAgent } from "./chat/ChatAgent.js";

/**
 * Initialize the chat widget when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeChatWidget();
});

/**
 * Initialize the chat widget
 */
async function initializeChatWidget() {
  try {
    // Create container for the chat widget
    const chatContainer = document.createElement("div");
    chatContainer.id = "chat-container";
    chatContainer.setAttribute("aria-label", "Assistant de chat ASEK");

    // Append to body
    document.body.appendChild(chatContainer);

    // Initialize the chat agent
    const chatAgent = new ChatAgent(chatContainer);

    // Make it globally available for debugging/external access
    window.ASEKChat = chatAgent;

    // Listen for chat events
    chatContainer.addEventListener("chatAgent:ready", (e) => {
      console.log("🚀 ASEK Chat Agent is ready!");

      // Optional: Auto-open chat for first-time visitors
      // checkFirstTimeVisit(chatAgent);
    });

    chatContainer.addEventListener("chatAgent:error", (e) => {
      console.error("💥 Chat Agent Error:", e.detail);
    });

    chatContainer.addEventListener("chatAgent:messageAdded", (e) => {
      // Optional: Track messages for analytics
      // trackChatMessage(e.detail.message);
    });
  } catch (error) {
    console.error("❌ Failed to initialize chat widget:", error);
  }
}

/**
 * Check if this is a first-time visit and show welcome
 * @param {ChatAgent} chatAgent
 */
function checkFirstTimeVisit(chatAgent) {
  const hasVisited = localStorage.getItem("asek_chat_visited");

  if (!hasVisited) {
    // Show welcome notification after a delay
    setTimeout(() => {
      chatAgent.ui.showNotification();
      localStorage.setItem("asek_chat_visited", "true");
    }, 3000);
  }
}

/**
 * Track chat messages (example integration)
 * @param {Object} message
 */
function trackChatMessage(message) {
  // Example: Send to Google Analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "chat_message", {
      event_category: "Chat",
      event_label: message.type,
      value: 1,
    });
  }

  // Example: Send to custom analytics
  // analyticsService.track('chat_message', {
  //   type: message.type,
  //   timestamp: message.timestamp
  // });
}

/**
 * Expose public API for external integration
 */
window.ASEKChatAPI = {
  /**
   * Send a message programmatically
   * @param {string} message
   */
  sendMessage: (message) => {
    if (window.ASEKChat && window.ASEKChat.isReady()) {
      window.ASEKChat.sendMessage(message);
    } else {
      console.warn("Chat not ready. Message queued.");
    }
  },

  /**
   * Open chat programmatically
   */
  openChat: () => {
    if (window.ASEKChat) {
      window.ASEKChat.openChat();
    }
  },

  /**
   * Close chat programmatically
   */
  closeChat: () => {
    if (window.ASEKChat) {
      window.ASEKChat.closeChat();
    }
  },

  /**
   * Clear chat history
   */
  clearHistory: () => {
    if (window.ASEKChat) {
      window.ASEKChat.clearHistory();
    }
  },

  /**
   * Get chat statistics
   */
  getStats: () => {
    if (window.ASEKChat) {
      return window.ASEKChat.getStats();
    }
    return null;
  },

  /**
   * Check if chat is ready
   */
  isReady: () => {
    return window.ASEKChat && window.ASEKChat.isReady();
  },
};

// Export for module usage
export { initializeChatWidget };
