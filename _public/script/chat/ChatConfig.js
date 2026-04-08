/**
 * Chat Configuration Module
 * Contains all configuration settings for the chat agent
 */

export const ChatConfig = {
  // UI Settings
  ui: {
    theme: "light", // 'light' | 'dark' - integrates with ASEK design system
    position: "bottom-right", // 'bottom-right' | 'bottom-left'
    animations: true,
    sound: false,
    autoExpand: false,
    maxMessagesDisplay: 100,
    brandTheme: "secondary", // 'primary' | 'secondary' - ASEK brand color integration
  },

  // Bot Settings
  bot: {
    name: "ASEK Assistant",
    avatar: "./_public/media/Logos/ASEK_Global_Logo.svg",
    welcomeMessage:
      "Bonjour ! Je suis l'assistant ASEK. Comment puis-je vous aider aujourd'hui ?",
    language: "fr",
    typingDelay: 1000, // milliseconds
    responseDelay: 500,
  },

  // API Settings
  api: {
    endpoint: null, // Add your API endpoint here if using external service
    timeout: 10000,
    retries: 3,
  },

  // Storage Settings
  storage: {
    enabled: true,
    key: "asek_chat_history",
    maxHistory: 50,
    persistSession: true,
  },

  // Feature flags
  features: {
    fileUpload: false,
    voiceInput: false,
    quickReplies: true,
    typing: true,
    timestamps: true,
  },

  // Quick replies for common questions
  quickReplies: [
    { text: "Horaires d'entraînement", action: "training_schedule" },
    { text: "Inscription", action: "registration" },
    { text: "Contact", action: "contact" },
    { text: "Tarifs", action: "pricing" },
  ],

  // Predefined responses
  responses: {
    training_schedule: {
      text: "Nos entraînements ont lieu :\n\n🏀 **Basketball:**\n- Lundi et Mercredi: 18h-20h\n- Samedi: 14h-16h\n\n⚽ **Football:**\n- Mardi et Jeudi: 18h-20h\n- Dimanche: 10h-12h\n\nVoulez-vous plus d'informations sur un sport en particulier ?",
      quickReplies: ["Basketball", "Football", "Inscription"],
    },
    registration: {
      text: "Pour vous inscrire à ASEK :\n\n1. 📋 Remplissez le formulaire d'inscription\n2. 📄 Fournissez les documents requis\n3. 💳 Effectuez le paiement\n\nÂge minimum : 6 ans\nCertificat médical requis\n\nSouhaitez-vous que je vous dirige vers le formulaire ?",
      quickReplies: ["Formulaire", "Documents requis", "Tarifs"],
    },
    contact: {
      text: "📞 **Contactez-nous :**\n\n📱 Téléphone: 061 123 456 788 9\n📧 Email: info@asekt.team\n📍 Adresse: Rue Test N° 12, Quartier Lemaroc 123456 Kénitra\n\n🕒 **Horaires d'accueil :**\nLundi-Vendredi: 9h-18h\nSamedi: 9h-12h",
      quickReplies: ["Horaires", "Localisation", "Email"],
    },
    pricing: {
      text: "💰 **Nos tarifs 2026 :**\n\n🏀 **Basketball:**\n- Enfants (6-12 ans): 200 DH/mois\n- Adolescents (13-17 ans): 250 DH/mois\n- Adultes (18+ ans): 300 DH/mois\n\n⚽ **Football:**\n- Enfants (6-12 ans): 180 DH/mois\n- Adolescents (13-17 ans): 230 DH/mois\n- Adultes (18+ ans): 280 DH/mois\n\n✨ Réduction de 10% pour 2 sports !",
      quickReplies: ["Inscription", "Réduction famille", "Paiement"],
    },
    default: {
      text: "Je suis désolé, je n'ai pas compris votre question. Voici comment je peux vous aider :",
      quickReplies: [
        "Horaires d'entraînement",
        "Inscription",
        "Contact",
        "Tarifs",
      ],
    },
  },
};

export default ChatConfig;
