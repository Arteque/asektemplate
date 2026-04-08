/**
 * Chat UI Module
 * Handles all user interface elements and interactions for the chat widget
 */

import { ChatConfig } from "./ChatConfig.js";

export class ChatUI {
  constructor(container) {
    this.container = container;
    this.config = ChatConfig.ui;
    this.botConfig = ChatConfig.bot;
    this.isOpen = false;
    this.isMinimized = false;
    this.elements = {};

    this.init();
  }

  /**
   * Initialize the chat UI
   */
  init() {
    this.createChatWidget();
    this.setupEventListeners();
    this.applyTheme();
    this.setupAnimations();

    // Initialize mobile state
    this.handleResize();
  }

  /**
   * Create the main chat widget structure
   */
  createChatWidget() {
    const brandClass = `brand-${this.config.brandTheme || "secondary"}`;
    const chatHTML = `
      <div class="chat-widget ${brandClass}" data-theme="${this.config.theme}" data-position="${this.config.position}">
        <!-- Chat Toggle Button -->
        <button class="chat-toggle" aria-label="Ouvrir le chat" title="Discuter avec notre assistant">
          <span class="chat-toggle-icon">
            <svg class="icon-chat" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            </svg>
            <svg class="icon-close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="chat-notification-badge" hidden>1</span>
        </button>

        <!-- Chat Window -->
        <div class="chat-window" role="dialog" aria-labelledby="chat-header-title" aria-hidden="true" inert>
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-header-info">
              <img class="chat-avatar" src="${this.botConfig.avatar}" alt="${this.botConfig.name}" />
              <div class="chat-header-text">
                <h3 id="chat-header-title">${this.botConfig.name}</h3>
                <span class="chat-status">En ligne</span>
              </div>
            </div>
            <div class="chat-header-actions">
              <button class="chat-minimize" aria-label="Réduire le chat" title="Réduire">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                </svg>
              </button>
              <button class="chat-close" aria-label="Fermer le chat" title="Fermer">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Chat Messages Container -->
          <div class="chat-messages" role="log" aria-live="polite" aria-label="Messages du chat">
          </div>

          <!-- Typing Indicator -->
          <div class="chat-typing" hidden>
            <div class="typing-indicator">
              <img class="message-avatar" src="${this.botConfig.avatar}" alt="${this.botConfig.name}" />
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Replies -->
          <div class="chat-quick-replies" hidden>
            <div class="quick-replies-container"></div>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-container">
            <form class="chat-form">
              <div class="chat-input-wrapper">
                <input 
                  type="text" 
                  class="chat-input" 
                  placeholder="Tapez votre message..." 
                  aria-label="Message à envoyer"
                  autocomplete="off"
                  maxlength="500"
                />
                <button type="submit" class="chat-send" aria-label="Envoyer le message" disabled>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div class="chat-input-footer">
                <small class="input-counter">0/500</small>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = chatHTML;
    this.cacheElements();
  }

  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    this.elements = {
      widget: this.container.querySelector(".chat-widget"),
      toggle: this.container.querySelector(".chat-toggle"),
      window: this.container.querySelector(".chat-window"),
      messages: this.container.querySelector(".chat-messages"),
      typing: this.container.querySelector(".chat-typing"),
      quickReplies: this.container.querySelector(".chat-quick-replies"),
      quickRepliesContainer: this.container.querySelector(
        ".quick-replies-container",
      ),
      form: this.container.querySelector(".chat-form"),
      input: this.container.querySelector(".chat-input"),
      sendBtn: this.container.querySelector(".chat-send"),
      closeBtn: this.container.querySelector(".chat-close"),
      minimizeBtn: this.container.querySelector(".chat-minimize"),
      counter: this.container.querySelector(".input-counter"),
      badge: this.container.querySelector(".chat-notification-badge"),
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Toggle chat window
    this.elements.toggle.addEventListener("click", () => this.toggleChat());

    // Close chat
    this.elements.closeBtn.addEventListener("click", () => this.closeChat());

    // Minimize chat
    this.elements.minimizeBtn.addEventListener("click", () =>
      this.minimizeChat(),
    );

    // Form submission
    this.elements.form.addEventListener("submit", (e) =>
      this.handleFormSubmit(e),
    );

    // Input events
    this.elements.input.addEventListener("input", () =>
      this.handleInputChange(),
    );
    this.elements.input.addEventListener("keydown", (e) =>
      this.handleKeyDown(e),
    );

    // Click outside to close (optional)
    if (this.config.closeOnClickOutside) {
      document.addEventListener("click", (e) => this.handleClickOutside(e));
    }

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeChat();
      }
    });

    // Resize handler
    window.addEventListener("resize", () => this.handleResize());

    // Mobile swipe gesture support
    if ("ontouchstart" in window) {
      this.setupMobileGestures();
    }
  }

  /**
   * Setup mobile touch gestures
   */
  setupMobileGestures() {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (!this.isOpen || window.innerWidth > 768) return;

      // Only allow drag from the top area of the chat window
      const rect = this.elements.window.getBoundingClientRect();
      const touchY = e.touches[0].clientY;

      if (touchY < rect.top + 60) {
        // Top 60px of chat window
        startY = touchY;
        isDragging = true;
        this.elements.window.style.transition = "none";
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;

      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only allow downward swipe
      if (deltaY > 0) {
        e.preventDefault();
        const progress = Math.min(deltaY / 200, 1); // 200px to fully close
        this.elements.window.style.transform = `translateY(${deltaY}px)`;
        this.elements.window.style.opacity = 1 - progress * 0.3;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      isDragging = false;
      this.elements.window.style.transition = "";

      const deltaY = currentY - startY;

      if (deltaY > 100) {
        // If swiped down more than 100px, close
        this.closeChat();
      } else {
        // Snap back to open position
        this.elements.window.style.transform = "";
        this.elements.window.style.opacity = "";
      }

      startY = 0;
      currentY = 0;
    };

    // Add touch listeners to the chat window
    this.elements.window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    this.elements.window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    this.elements.window.addEventListener("touchend", handleTouchEnd);
  }

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  handleFormSubmit(e) {
    e.preventDefault();
    const message = this.elements.input.value.trim();

    if (message) {
      this.dispatchEvent("message", { message });
      this.elements.input.value = "";
      this.updateSendButton();
      this.updateInputCounter();
    }
  }

  /**
   * Handle input changes
   */
  handleInputChange() {
    this.updateSendButton();
    this.updateInputCounter();

    // Dispatch typing event if needed
    if (this.elements.input.value.trim()) {
      this.dispatchEvent("typing");
    }
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.elements.form.dispatchEvent(new Event("submit"));
    }
  }

  /**
   * Handle click outside chat
   * @param {MouseEvent} e - Click event
   */
  handleClickOutside(e) {
    if (this.isOpen && !this.elements.widget.contains(e.target)) {
      this.closeChat();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const isMobile = window.innerWidth <= 768;

    // Add/remove mobile class
    if (isMobile) {
      this.elements.widget.classList.add("mobile");

      // On mobile, if chat is open, ensure proper positioning
      if (this.isOpen) {
        document.body.style.overflow = "hidden"; // Prevent background scroll
        this.elements.window.classList.add("open");
      }
    } else {
      this.elements.widget.classList.remove("mobile");

      // Restore body scroll on desktop
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }

      this.elements.window.classList.remove("open");
    }
  }

  /**
   * Toggle chat window open/closed
   */
  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  /**
   * Open chat window
   */
  openChat() {
    if (this.isMinimized) {
      this.isMinimized = false;
      this.elements.widget.classList.remove("minimized");
    }

    this.isOpen = true;
    this.elements.widget.classList.add("open");
    this.elements.window.setAttribute("aria-hidden", "false");
    this.elements.window.removeAttribute("inert");
    this.elements.toggle.setAttribute("aria-label", "Fermer le chat");

    // Mobile-specific behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = "hidden"; // Prevent background scroll
      this.elements.window.classList.add("open");

      // Longer delay for mobile slide animation
      setTimeout(() => {
        this.setupFocusTrap();
        this.elements.input.focus();
      }, 400);
    } else {
      // Desktop behavior
      setTimeout(() => {
        this.setupFocusTrap();
        this.elements.input.focus();
      }, 300);
    }

    // Hide notification badge
    this.hideNotification();

    // Scroll to bottom
    this.scrollToBottom();

    this.dispatchEvent("open");
  }

  /**
   * Close chat window
   */
  closeChat() {
    // Remove focus trap
    this.removeFocusTrap();

    // Remove focus from any focused elements inside the chat window before hiding
    const activeElement = document.activeElement;
    if (activeElement && this.elements.window.contains(activeElement)) {
      activeElement.blur();
      // Move focus to the chat toggle button
      this.elements.toggle.focus();
    }

    // Mobile-specific behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = ""; // Restore background scroll
      this.elements.window.classList.remove("open");
    }

    this.isOpen = false;
    this.isMinimized = false;
    this.elements.widget.classList.remove("open", "minimized");
    this.elements.window.setAttribute("aria-hidden", "true");
    this.elements.window.setAttribute("inert", "");
    this.elements.toggle.setAttribute("aria-label", "Ouvrir le chat");

    this.dispatchEvent("close");
  }

  /**
   * Minimize chat window
   */
  minimizeChat() {
    this.isMinimized = true;
    this.elements.widget.classList.add("minimized");

    this.dispatchEvent("minimize");
  }

  /**
   * Add message to chat
   * @param {Object} message - Message object
   */
  addMessage(message) {
    const messageEl = this.createMessageElement(message);
    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();

    // Show quick replies if provided
    if (message.quickReplies && message.quickReplies.length > 0) {
      this.showQuickReplies(message.quickReplies);
    } else {
      this.hideQuickReplies();
    }

    // Announce message to screen readers
    if (message.type === "bot") {
      this.announceMessage(message.text);
    }
  }

  /**
   * Create message element
   * @param {Object} message - Message object
   * @returns {HTMLElement} Message element
   */
  createMessageElement(message) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${message.type}-message`;
    messageEl.setAttribute("data-timestamp", message.timestamp);

    const isBot = message.type === "bot";
    const avatar = isBot ? this.botConfig.avatar : null;

    messageEl.innerHTML = `
      ${avatar ? `<img class="message-avatar" src="${avatar}" alt="${this.botConfig.name}" />` : ""}
      <div class="message-content">
        <div class="message-bubble">
          ${this.formatMessageText(message.text)}
        </div>
        <div class="message-time">${this.formatTime(new Date(message.timestamp))}</div>
      </div>
    `;

    return messageEl;
  }

  /**
   * Format message text (convert newlines to <br>, etc.)
   * @param {string} text - Raw text
   * @returns {string} Formatted HTML
   */
  formatMessageText(text) {
    return text
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      );
  }

  /**
   * Show quick replies
   * @param {Array} replies - Array of quick reply options
   */
  showQuickReplies(replies) {
    this.elements.quickRepliesContainer.innerHTML = "";

    replies.forEach((reply) => {
      const button = document.createElement("button");
      button.className = "quick-reply-btn";
      button.textContent = reply;
      button.addEventListener("click", () => {
        this.dispatchEvent("quickReply", { reply });
        this.hideQuickReplies();
      });

      this.elements.quickRepliesContainer.appendChild(button);
    });

    this.elements.quickReplies.removeAttribute("hidden");
    this.scrollToBottom();
  }

  /**
   * Hide quick replies
   */
  hideQuickReplies() {
    this.elements.quickReplies.setAttribute("hidden", "");
  }

  /**
   * Show typing indicator
   */
  showTyping() {
    this.elements.typing.removeAttribute("hidden");
    this.scrollToBottom();
  }

  /**
   * Hide typing indicator
   */
  hideTyping() {
    this.elements.typing.setAttribute("hidden", "");
  }

  /**
   * Show notification badge
   * @param {number} count - Notification count
   */
  showNotification(count = 1) {
    this.elements.badge.textContent = count;
    this.elements.badge.removeAttribute("hidden");
  }

  /**
   * Hide notification badge
   */
  hideNotification() {
    this.elements.badge.setAttribute("hidden", "");
  }

  /**
   * Update send button state
   */
  updateSendButton() {
    const hasText = this.elements.input.value.trim().length > 0;
    this.elements.sendBtn.disabled = !hasText;
  }

  /**
   * Update input character counter
   */
  updateInputCounter() {
    const length = this.elements.input.value.length;
    const max = this.elements.input.maxLength;
    this.elements.counter.textContent = `${length}/${max}`;

    if (length > max * 0.9) {
      this.elements.counter.classList.add("warning");
    } else {
      this.elements.counter.classList.remove("warning");
    }
  }

  /**
   * Scroll messages to bottom
   */
  scrollToBottom() {
    setTimeout(() => {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }, 100);
  }

  /**
   * Apply theme
   */
  applyTheme() {
    this.elements.widget.setAttribute("data-theme", this.config.theme);

    // Add brand class for ASEK color integration
    const brandClass = `brand-${this.config.brandTheme || "secondary"}`;
    this.elements.widget.classList.remove("brand-primary", "brand-secondary");
    this.elements.widget.classList.add(brandClass);
  }

  /**
   * Setup animations
   */
  setupAnimations() {
    if (!this.config.animations) {
      this.elements.widget.classList.add("no-animations");
    }
  }

  /**
   * Format time for display
   * @param {Date} date - Date object
   * @returns {string} Formatted time string
   */
  formatTime(date) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message text
   */
  announceMessage(message) {
    const announcement = document.createElement("div");
    announcement.className = "sr-only";
    announcement.setAttribute("aria-live", "assertive");
    announcement.textContent = `Nouveau message: ${message}`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Clear all messages
   */
  clearMessages() {
    this.elements.messages.innerHTML = "";
    this.hideQuickReplies();
  }

  /**
   * Dispatch custom event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`chat:${eventName}`, { detail });
    this.container.dispatchEvent(event);
  }

  /**
   * Get all focusable elements within the chat window
   * @returns {NodeList} All focusable elements
   */
  getFocusableElements() {
    const selectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return this.elements.window.querySelectorAll(selectors);
  }

  /**
   * Setup focus trap for accessibility
   */
  setupFocusTrap() {
    if (!this.isOpen) return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Handler for Tab key navigation
    const handleTabKey = (e) => {
      if (e.key !== "Tab" || !this.isOpen) return;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    // Store the handler reference for cleanup
    this._focusTrapHandler = handleTabKey;
    this.elements.window.addEventListener("keydown", handleTabKey);
  }

  /**
   * Remove focus trap
   */
  removeFocusTrap() {
    if (this._focusTrapHandler) {
      this.elements.window.removeEventListener(
        "keydown",
        this._focusTrapHandler,
      );
      this._focusTrapHandler = null;
    }
  }

  /**
   * Destroy the chat UI
   */
  destroy() {
    // Clean up focus trap
    this.removeFocusTrap();

    if (this.elements.widget) {
      this.elements.widget.remove();
    }
  }
}

export default ChatUI;
