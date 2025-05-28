// File: app/components/layout/ChatBot/animations.js
export const chatBubbleVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      damping: 15, 
      stiffness: 300 
    } 
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

export const typingIndicatorVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.5
    } 
  }
};

export const chatContainerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 350,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

export const floatingButtonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  hover: { 
    scale: 1.1,
    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

export const quickPromptVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (custom) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: custom * 0.05,
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }),
  hover: { 
    scale: 1.05,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};