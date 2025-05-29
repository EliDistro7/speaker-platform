// ChatBot Configuration Constants
export const CHAT_CONFIG = {
  // Timing configurations
  TYPING_DELAY: 1500,
  RESTORATION_DELAY: 300,
  CLOSE_ANIMATION_DELAY: 200,
  SCROLL_DELAY: 100,
  QUICK_PROMPT_DELAY: 300,
  OUTSIDE_CLICK_DELAY: 100,

  // UI configurations
  MOBILE_BREAKPOINT: 640,
  DESKTOP_WIDTH: 'w-80 md:w-96',
  DESKTOP_HEIGHT: 'h-[32rem]',
  MAX_HEIGHT: 'max-h-[85vh]',

  // Conversation persistence
  STORAGE_KEY: 'chatbot_last_conversation',
  CONVERSATION_EXPIRY: 60 * 60 * 1000, // 1 hour in milliseconds

  // Service context
  DEEP_CONVERSATION_THRESHOLD: 3,
  HIGH_ENGAGEMENT_THRESHOLD: 5,
  AUTO_LANGUAGE_SWITCH_THRESHOLD: 2,

  // Animation configurations
  ANIMATION_DURATION: 0.3,
  SCALE_ANIMATION: 0.95,

  // Z-index values
  Z_INDEX_MOBILE: 50,
  Z_INDEX_DESKTOP: 40,

  // Error configurations
  MAX_RETRY_ATTEMPTS: 3,
  ERROR_DISPLAY_DURATION: 5000,

  // Performance configurations
  MESSAGE_BATCH_SIZE: 50,
  SCROLL_DEBOUNCE: 16, // ~60fps
};

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  chatContainer: {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: CHAT_CONFIG.ANIMATION_DURATION
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  },

  floatingButton: {
    hidden: { 
      scale: 0, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.9 
    }
  },

  message: {
    hidden: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  },

  quickPrompt: {
    hidden: { 
      opacity: 0, 
      x: -10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: { 
      scale: 1.02,
      backgroundColor: "rgba(59, 130, 246, 0.1)"
    },
    tap: { 
      scale: 0.98 
    }
  },

  typingIndicator: {
    hidden: { 
      opacity: 0 
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }
};

// CSS classes for consistent styling
export const STYLE_CLASSES = {
  // Container classes
  chatContainer: {
    mobile: 'fixed inset-0 w-full h-full max-h-full rounded-none',
    desktop: 'w-80 md:w-96 h-[32rem] rounded-2xl max-h-[85vh]',
    base: 'bg-gray-900 shadow-2xl overflow-hidden flex flex-col border border-gray-700 backdrop-blur-lg'
  },

  // Header classes
  header: {
    base: 'flex items-center justify-between p-4 border-b border-gray-700',
    gradient: 'bg-gradient-to-r from-blue-900/50 to-purple-900/50'
  },

  // Message classes
  message: {
    user: 'bg-blue-600 text-white ml-auto',
    bot: 'bg-gray-700 text-gray-100 mr-auto',
    system: 'bg-yellow-900/30 text-yellow-300 mx-auto text-center',
    base: 'max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed'
  },

  // Input classes
  input: {
    base: 'flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none',
    container: 'flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-600/30'
  },

  // Button classes
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200',
    close: 'text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200'
  },

  // Service indicator classes
  serviceIndicator: {
    base: 'service-indicator px-2 py-1 rounded-full text-xs',
    active: 'text-blue-300 bg-blue-500/20',
    deep: 'deep-conversation-badge'
  },

  // Scrollbar classes
  scrollbar: {
    thin: 'scrollbar-thin',
    custom: 'custom-scrollbar'
  }
};

// Default UI text (fallback)
export const DEFAULT_UI_TEXT = {
  en: {
    title: 'Chat Assistant',
    inputPlaceholder: 'Type your message...',
    contactUs: 'Contact Us',
    send: 'Send',
    close: 'Close',
    minimize: 'Minimize',
    typing: 'Typing...',
    error: 'Something went wrong',
    retry: 'Try Again'
  },
  sw: {
    title: 'Msaidizi wa Mazungumzo',
    inputPlaceholder: 'Andika ujumbe wako...',
    contactUs: 'Wasiliana Nasi',
    send: 'Tuma',
    close: 'Funga',
    minimize: 'Punguza',
    typing: 'Inaandika...',
    error: 'Kuna tatizo',
    retry: 'Jaribu Tena'
  }
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  CLOSE_CHAT: 'Escape',
  SEND_MESSAGE: 'Enter',
  FOCUS_INPUT: '/',
  CLEAR_INPUT: 'Escape' // when input is focused
};

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  // React.memo comparison function
  shouldComponentUpdate: (prevProps, nextProps) => {
    // Add custom comparison logic here
    return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
  },

  // Debounce settings
  debounce: {
    typing: 300,
    scroll: 16,
    resize: 250,
    search: 500
  },

  // Throttle settings
  throttle: {
    scroll: 16,
    resize: 100,
    animation: 16
  }
};

export default {
  CHAT_CONFIG,
  ANIMATION_VARIANTS,
  STYLE_CLASSES,
  DEFAULT_UI_TEXT,
  KEYBOARD_SHORTCUTS,
  PERFORMANCE_CONFIG
};