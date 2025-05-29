// File: app/components/layout/ChatBot/hooks/useChatState.js
import { useState, useEffect } from 'react';
import { chatbotData } from '@/data/chat/index';
import { createFreshServiceContext } from '@/utils/serviceContextUtils';

/**
 * Custom hook to manage core chat state
 * Handles messages, typing indicator, suggestions, and service context
 */
export function useChatState(language) {
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [serviceContext, setServiceContext] = useState(() => createFreshServiceContext());

  // Initialize chat messages when language changes
  useEffect(() => {
    setChatMessages([
      { role: 'bot', content: chatbotData.welcome[language] }
    ]);
    setSuggestions(chatbotData.prompts[language]);
    // Reset service context when language changes
    setServiceContext(createFreshServiceContext());
  }, [language]);

  // Helper function to add a message
  const addMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };

  // Helper function to add multiple messages
  const addMessages = (messages) => {
    setChatMessages(prev => [...prev, ...messages]);
  };

  // Helper function to reset chat
  const resetChat = () => {
    setChatMessages([{ role: 'bot', content: chatbotData.welcome[language] }]);
    setServiceContext(createFreshServiceContext());
    setActiveService(null);
    setSuggestions(chatbotData.prompts[language]);
    setIsTyping(false);
  };

  // Helper function to update service context
  const updateServiceContextState = (newContext) => {
    setServiceContext(newContext);
  };

  // Helper function to update suggestions
  const updateSuggestions = (newSuggestions) => {
    setSuggestions(newSuggestions);
  };

  return {
    // State
    chatMessages,
    isTyping,
    suggestions,
    activeService,
    serviceContext,
    
    // Setters
    setChatMessages,
    setIsTyping,
    setSuggestions,
    setActiveService,
    setServiceContext,
    
    // Helper functions
    addMessage,
    addMessages,
    resetChat,
    updateServiceContextState,
    updateSuggestions
  };
}