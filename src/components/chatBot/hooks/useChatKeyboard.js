// File: app/components/layout/ChatBot/hooks/useChatKeyboard.js
import { useEffect } from 'react';

/**
 * Custom hook to manage chat keyboard interactions
 * Handles ESC key for closing chat and other keyboard shortcuts
 */
export function useChatKeyboard(isChatOpen, isClosing, onClose) {
  
  // Handle ESC key to close chat
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isChatOpen && !isClosing) {
        event.preventDefault();
        onClose(true); // Save conversation when closing with ESC
      }
    };

    if (isChatOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChatOpen, isClosing, onClose]);

  // Handle Enter key in input (can be extended for other shortcuts)
  const handleInputKeyDown = (event, onSend) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return {
    handleInputKeyDown
  };
}