/**
 * Chat Bot Module
 * Handles bot logic, natural language processing, and response generation
 */

import { ChatConfig } from "./ChatConfig.js";

export class ChatBot {
  constructor() {
    this.config = ChatConfig.bot;
    this.responses = ChatConfig.responses;
    this.isTyping = false;
    this.context = {
      lastTopic: null,
      userPreferences: {},
      sessionData: {},
    };

    // Initialize response patterns
    this.initializePatterns();
  }

  /**
   * Initialize keyword patterns for intent recognition
   */
  initializePatterns() {
    this.patterns = {
      greeting: [
        /\b(bonjour|salut|hello|hey|bonsoir|bonne (journée|soirée))\b/i,
      ],
      training_schedule: [
        /\b(horaire|planning|entraînement|séance|quand|heure)\b/i,
        /\b(basketball|basket|foot|football)\b/i,
      ],
      registration: [
        /\b(inscription|inscrire|rejoindre|adhérer|membre)\b/i,
        /\b(comment (s\'inscrire|rejoindre))\b/i,
      ],
      contact: [
        /\b(contact|téléphone|email|adresse|où|localisation)\b/i,
        /\b(appeler|joindre|contacter)\b/i,
      ],
      pricing: [
        /\b(tarif|prix|coût|combien|payer|paiement)\b/i,
        /\b(cher|euros?|dirhams?|dh)\b/i,
      ],
      goodbye: [/\b(au revoir|bye|tchao|merci|à bientôt)\b/i],
      help: [/\b(aide|aider|help|assistance|comment)\b/i],
    };
  }

  /**
   * Process user message and generate appropriate response
   * @param {string} message - User message
   * @returns {Promise<Object>} Bot response object
   */
  async processMessage(message) {
    const userMessage = message.trim().toLowerCase();

    // Detect intent from user message
    const intent = this.detectIntent(userMessage);

    // Update context
    this.updateContext(intent, userMessage);

    // Generate response based on intent
    const response = await this.generateResponse(intent, userMessage);

    return {
      text: response.text,
      quickReplies: response.quickReplies || [],
      type: "bot",
      timestamp: Date.now(),
      intent: intent,
    };
  }

  /**
   * Detect user intent from message
   * @param {string} message - User message
   * @returns {string} Detected intent
   */
  detectIntent(message) {
    // Check for exact quick reply matches first
    const quickReplyMatch = this.config.quickReplies?.find((qr) =>
      message.toLowerCase().includes(qr.text.toLowerCase()),
    );

    if (quickReplyMatch) {
      return quickReplyMatch.action;
    }

    // Pattern matching for intent detection
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          return intent;
        }
      }
    }

    // Context-based intent detection
    if (this.context.lastTopic) {
      if (
        message.includes("oui") ||
        message.includes("ok") ||
        message.includes("d'accord")
      ) {
        return this.context.lastTopic;
      }
    }

    return "default";
  }

  /**
   * Generate response based on intent
   * @param {string} intent - Detected intent
   * @param {string} userMessage - Original user message
   * @returns {Promise<Object>} Response object
   */
  async generateResponse(intent, userMessage) {
    // Handle greeting with personalization
    if (intent === "greeting") {
      const greetings = [
        "Bonjour ! Bienvenue chez ASEK ! 🏀⚽",
        "Salut ! Ravi de vous voir ! Comment puis-je vous aider ?",
        "Bonjour ! Je suis là pour répondre à vos questions sur ASEK.",
      ];

      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

      return {
        text: randomGreeting,
        quickReplies: [
          "Horaires d'entraînement",
          "Inscription",
          "Contact",
          "Tarifs",
        ],
      };
    }

    // Handle goodbye
    if (intent === "goodbye") {
      const goodbyes = [
        "Au revoir ! À bientôt chez ASEK ! 👋",
        "Merci de votre visite ! N'hésitez pas à revenir !",
        "À bientôt ! Passez une excellente journée ! 🌟",
      ];

      return {
        text: goodbyes[Math.floor(Math.random() * goodbyes.length)],
        quickReplies: [],
      };
    }

    // Handle help request
    if (intent === "help") {
      return {
        text: "Je peux vous aider avec :\n\n🏀 Informations sur le basketball\n⚽ Informations sur le football\n📝 Processus d'inscription\n📞 Coordonnées de contact\n💰 Tarifs et paiements\n⏰ Horaires d'entraînement\n\nQue souhaitez-vous savoir ?",
        quickReplies: [
          "Horaires d'entraînement",
          "Inscription",
          "Contact",
          "Tarifs",
        ],
      };
    }

    // Use predefined responses
    if (this.responses[intent]) {
      const response = this.responses[intent];

      // Add contextual variations
      let text = response.text;

      // Add personalization based on previous interactions
      if (
        intent === "training_schedule" &&
        this.context.userPreferences.sport
      ) {
        text = this.addSportSpecificInfo(
          text,
          this.context.userPreferences.sport,
        );
      }

      return {
        text: text,
        quickReplies: response.quickReplies || [],
      };
    }

    // Default response with helpful suggestions
    return this.generateSmartDefault(userMessage);
  }

  /**
   * Generate smart default response based on message analysis
   * @param {string} message - User message
   * @returns {Object} Default response object
   */
  generateSmartDefault(message) {
    const keywords = message.toLowerCase().split(" ");
    let suggestions = [
      "Horaires d'entraînement",
      "Inscription",
      "Contact",
      "Tarifs",
    ];

    // Analyze keywords to provide better suggestions
    if (
      keywords.some((word) => ["sport", "jouer", "activité"].includes(word))
    ) {
      suggestions = [
        "Basketball",
        "Football",
        "Horaires d'entraînement",
        "Inscription",
      ];
    } else if (
      keywords.some((word) => ["enfant", "fils", "fille", "âge"].includes(word))
    ) {
      suggestions = [
        "Inscription",
        "Tarifs",
        "Horaires d'entraînement",
        "Documents requis",
      ];
    } else if (
      keywords.some((word) => ["coût", "cher", "budget"].includes(word))
    ) {
      suggestions = ["Tarifs", "Réduction famille", "Paiement", "Inscription"];
    }

    return {
      text: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ou choisir un sujet ci-dessous ?",
      quickReplies: suggestions,
    };
  }

  /**
   * Add sport-specific information to response
   * @param {string} text - Base response text
   * @param {string} sport - Preferred sport
   * @returns {string} Enhanced text
   */
  addSportSpecificInfo(text, sport) {
    if (sport === "basketball") {
      return (
        text +
        "\n\n🏀 **Info Basketball:** Nous avons des équipes compétitives et loisir !"
      );
    } else if (sport === "football") {
      return (
        text +
        "\n\n⚽ **Info Football:** Terrain en herbe synthétique disponible !"
      );
    }
    return text;
  }

  /**
   * Update conversation context
   * @param {string} intent - Current intent
   * @param {string} message - User message
   */
  updateContext(intent, message) {
    this.context.lastTopic = intent;

    // Extract user preferences from message
    if (message.includes("basketball") || message.includes("basket")) {
      this.context.userPreferences.sport = "basketball";
    } else if (message.includes("football") || message.includes("foot")) {
      this.context.userPreferences.sport = "football";
    }

    // Track session data
    this.context.sessionData.lastMessageTime = Date.now();
    this.context.sessionData.messageCount =
      (this.context.sessionData.messageCount || 0) + 1;
  }

  /**
   * Simulate typing indicator
   * @returns {Promise} Promise that resolves after typing delay
   */
  async simulateTyping() {
    this.isTyping = true;
    await new Promise((resolve) =>
      setTimeout(resolve, this.config.typingDelay),
    );
    this.isTyping = false;
  }

  /**
   * Get bot information
   * @returns {Object} Bot info object
   */
  getBotInfo() {
    return {
      name: this.config.name,
      avatar: this.config.avatar,
      language: this.config.language,
      version: "1.0.0",
      capabilities: [
        "Informations sur les sports",
        "Processus d'inscription",
        "Horaires et contact",
        "Tarifs et paiements",
      ],
    };
  }

  /**
   * Reset conversation context
   */
  resetContext() {
    this.context = {
      lastTopic: null,
      userPreferences: {},
      sessionData: {},
    };
  }
}

export default ChatBot;
