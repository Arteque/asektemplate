# 🤖 ASEK Chat Agent System

A comprehensive, modular chat agent system built with vanilla JavaScript ES6 modules and classes. This system provides an intelligent chat interface for the ASEK sports club website.

## ✨ Features

### 🎯 Core Features

- **Modular Architecture**: Built with ES6 modules and classes for maintainability
- **Intelligent Bot**: Contextual responses for sports club inquiries
- **Multilingual Support**: French language optimized with easy localization
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Screen reader compatible with ARIA labels and keyboard navigation

### 🎨 User Interface

- **Modern Dark/Light themes** with automatic system preference detection
- **Smooth animations** with reduced motion support
- **Real-time typing indicators** for better user experience
- **Quick reply buttons** for common questions
- **Chat history persistence** using localStorage
- **Notification badges** for new messages

### 🧠 AI Capabilities

- **Intent recognition** based on keywords and patterns
- **Contextual conversations** that remember previous interactions
- **Sport-specific responses** for basketball and football
- **Dynamic quick replies** based on conversation flow
- **Fallback handling** with helpful suggestions

## 📁 File Structure

```
_public/
├── script/
│   ├── chat/
│   │   ├── ChatAgent.js      # Main orchestrator class
│   │   ├── ChatUI.js         # UI management and interactions
│   │   ├── ChatBot.js        # Bot logic and NLP
│   │   ├── ChatStorage.js    # LocalStorage management
│   │   └── ChatConfig.js     # Configuration settings
│   ├── chat-init.js          # Initialization script
│   └── App.js               # Existing app functionality
└── style/
    ├── chat.css             # Chat widget styles
    └── App.css             # Existing app styles
```

## 🚀 Quick Start

### 1. Installation

The chat system is already integrated into your website. Simply load the page and the chat widget will appear in the bottom-right corner.

### 2. Basic Usage

```javascript
// The chat system is automatically initialized when the DOM is ready
// Access the chat API through the global object:

// Send a message programmatically
window.ASEKChatAPI.sendMessage("Bonjour!");

// Open chat programmatically
window.ASEKChatAPI.openChat();

// Close chat programmatically
window.ASEKChatAPI.closeChat();

// Check if chat is ready
if (window.ASEKChatAPI.isReady()) {
  console.log("Chat is ready to use!");
}
```

### 3. Configuration

Edit `_public/script/chat/ChatConfig.js` to customize:

```javascript
export const ChatConfig = {
  ui: {
    theme: "light", // 'light' | 'dark'
    position: "bottom-right", // 'bottom-right' | 'bottom-left'
    animations: true,
    autoExpand: false,
  },
  bot: {
    name: "ASEK Assistant",
    welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
    language: "fr",
    typingDelay: 1000,
  },
  // ... more configuration options
};
```

## 🎛️ Advanced Usage

### Custom Responses

Add new response patterns in `ChatConfig.js`:

```javascript
responses: {
  custom_topic: {
    text: 'Your custom response here',
    quickReplies: ['Option 1', 'Option 2']
  }
}
```

### Event Listeners

Listen to chat events:

```javascript
document.addEventListener("chatAgent:ready", (e) => {
  console.log("Chat is ready!");
});

document.addEventListener("chatAgent:messageAdded", (e) => {
  console.log("New message:", e.detail.message);
});

document.addEventListener("chatAgent:error", (e) => {
  console.error("Chat error:", e.detail);
});
```

### Custom Intent Recognition

Extend the bot's understanding in `ChatBot.js`:

```javascript
initializePatterns() {
  this.patterns = {
    // Add your custom patterns
    custom_intent: [
      /\\b(keyword1|keyword2|keyword3)\\b/i,
      /\\bcustom pattern\\b/i
    ],
    // ... existing patterns
  };
}
```

## 🎨 Customization

### Styling

The chat widget uses CSS custom properties for easy theming:

```css
.chat-widget {
  --chat-primary: #2563eb; /* Primary color */
  --chat-background: #ffffff; /* Background color */
  --chat-text: #1e293b; /* Text color */
  --chat-radius: 16px; /* Border radius */
  /* ... more CSS variables */
}
```

### Themes

Switch themes programmatically:

```javascript
// Update theme
window.ASEKChat.updateConfig({
  ui: { theme: "dark" },
});
```

### Mobile Responsiveness

The chat automatically adapts to mobile screens:

- Full-screen overlay on devices < 768px
- Optimized touch targets
- Swipe gestures support

## 📊 Analytics Integration

Track chat interactions:

```javascript
// Google Analytics example
document.addEventListener("chatAgent:messageAdded", (e) => {
  if (typeof gtag !== "undefined") {
    gtag("event", "chat_message", {
      event_category: "Chat",
      event_label: e.detail.message.type,
    });
  }
});
```

## 🔧 API Reference

### ChatAgent Class

```javascript
const chatAgent = new ChatAgent(containerElement);

// Methods
chatAgent.sendMessage(message); // Send message programmatically
chatAgent.openChat(); // Open chat window
chatAgent.closeChat(); // Close chat window
chatAgent.clearHistory(); // Clear chat history
chatAgent.getStats(); // Get usage statistics
chatAgent.isReady(); // Check if initialized
chatAgent.destroy(); // Cleanup and destroy
```

### Global API (window.ASEKChatAPI)

```javascript
// Public methods available globally
ASEKChatAPI.sendMessage(message);
ASEKChatAPI.openChat();
ASEKChatAPI.closeChat();
ASEKChatAPI.clearHistory();
ASEKChatAPI.getStats();
ASEKChatAPI.isReady();
```

## 🐛 Troubleshooting

### Common Issues

1. **Chat not appearing**: Check browser console for errors and ensure all script files are loaded
2. **Styling issues**: Verify that `chat.css` is properly loaded
3. **Module errors**: Ensure your server supports ES6 modules (use HTTPS or local server)

### Debug Mode

Enable debug logging in `ChatConfig.js`:

```javascript
export const ChatConfig = {
  debug: true, // Enable debug logging
  // ... other config
};
```

### Browser Compatibility

- **Modern browsers**: Full support (Chrome 61+, Firefox 60+, Safari 10.1+)
- **ES6 modules**: Required for proper functionality
- **LocalStorage**: Used for chat history (graceful degradation if unavailable)

## 🔄 Updates

### Adding New Features

1. Create new module in `_public/script/chat/`
2. Import and integrate in `ChatAgent.js`
3. Update configuration in `ChatConfig.js`
4. Add corresponding styles in `chat.css`

### Extending Bot Intelligence

1. Add new patterns in `ChatBot.js`
2. Create response templates in `ChatConfig.js`
3. Test with various user inputs

## 📝 Contributing

When modifying the chat system:

1. **Follow the modular pattern**: Each feature should be in its own module
2. **Maintain accessibility**: Always include ARIA labels and keyboard support
3. **Test responsiveness**: Verify functionality on mobile devices
4. **Update documentation**: Keep this README current with any changes

## 🎯 Roadmap

Future enhancements could include:

- Voice input/output support
- File upload capabilities
- Integration with external AI services
- Multi-language support expansion
- Advanced analytics dashboard
- Chatbot training interface

## 📄 License

This chat system is part of the ASEK website project and follows the same licensing terms.

---

**🏀⚽ Built with passion for ASEK - Association Sportive Élite Kénitra**
