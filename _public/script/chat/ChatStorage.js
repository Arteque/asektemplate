/**
 * Chat Storage Module
 * Handles local storage for chat history and user preferences
 */

import { ChatConfig } from "./ChatConfig.js";

export class ChatStorage {
  constructor() {
    this.config = ChatConfig.storage;
    this.isSupported = this.checkStorageSupport();
  }

  /**
   * Check if localStorage is supported and available
   * @returns {boolean}
   */
  checkStorageSupport() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn("LocalStorage not supported:", error);
      return false;
    }
  }

  /**
   * Save chat history to localStorage
   * @param {Array} messages - Array of message objects
   */
  saveHistory(messages) {
    if (!this.config.enabled || !this.isSupported) return;

    try {
      // Keep only the last maxHistory messages
      const limitedMessages = messages.slice(-this.config.maxHistory);

      const historyData = {
        messages: limitedMessages,
        timestamp: Date.now(),
        version: "1.0",
      };

      localStorage.setItem(this.config.key, JSON.stringify(historyData));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }

  /**
   * Load chat history from localStorage
   * @returns {Array} Array of message objects
   */
  loadHistory() {
    if (!this.config.enabled || !this.isSupported) return [];

    try {
      const data = localStorage.getItem(this.config.key);
      if (!data) return [];

      const historyData = JSON.parse(data);

      // Check if data is valid and not too old (24 hours)
      const isValid =
        historyData &&
        historyData.messages &&
        Array.isArray(historyData.messages) &&
        Date.now() - historyData.timestamp < 24 * 60 * 60 * 1000;

      return isValid ? historyData.messages : [];
    } catch (error) {
      console.error("Failed to load chat history:", error);
      return [];
    }
  }

  /**
   * Clear all chat history
   */
  clearHistory() {
    if (!this.isSupported) return;

    try {
      localStorage.removeItem(this.config.key);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  }

  /**
   * Save user preferences
   * @param {Object} preferences - User preferences object
   */
  savePreferences(preferences) {
    if (!this.isSupported) return;

    try {
      const key = `${this.config.key}_preferences`;
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }

  /**
   * Load user preferences
   * @returns {Object} User preferences object
   */
  loadPreferences() {
    if (!this.isSupported) return {};

    try {
      const key = `${this.config.key}_preferences`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Failed to load preferences:", error);
      return {};
    }
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage usage information
   */
  getStats() {
    if (!this.isSupported) {
      return { supported: false };
    }

    try {
      const data = localStorage.getItem(this.config.key);
      const size = data ? new Blob([data]).size : 0;

      return {
        supported: true,
        size: size,
        sizeFormatted: this.formatBytes(size),
        messageCount: data ? JSON.parse(data).messages?.length || 0 : 0,
      };
    } catch (error) {
      return { supported: true, error: error.message };
    }
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes
   * @returns {string}
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

export default ChatStorage;
