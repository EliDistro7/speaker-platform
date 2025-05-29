// File: app/components/layout/ChatBot/hooks/useChatUI.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage chat UI state
 * Handles open/close state, screen size detection, and UI animations
 */
export function useChatUI() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [message, setMessage] = useState('');

  // Update screen size state when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Open chat handler
  const openChat = () => {
    setIsChatOpen(true);
  };

  // Close chat handler with animation
  const closeChat = () => {
    setIsClosing(true);
    setMessage(''); // Clear input
    
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 200);
  };

  // Toggle chat state
  const toggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  return {
    // State
    isChatOpen,
    isClosing,
    isSmallScreen,
    message,
    
    // Setters
    setIsChatOpen,
    setIsClosing,
    setMessage,
    
    // Actions
    openChat,
    closeChat,
    toggleChat
  };
}