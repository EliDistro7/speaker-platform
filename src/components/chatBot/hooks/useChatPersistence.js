// File: app/components/layout/ChatBot/hooks/useChatPersistence.js
import { useCallback } from 'react';

/**
 * Custom hook to manage chat persistence
 * Handles saving and restoring conversation state
 */
export function useChatPersistence(language) {
  
  // Save conversation to sessionStorage
  const saveConversation = useCallback((chatMessages, serviceContext, activeService) => {
    if (chatMessages.length <= 1) return false;
    
    try {
      const conversationState = {
        messages: chatMessages,
        serviceContext: serviceContext,
        activeService: activeService,
        timestamp: new Date().toISOString(),
        language: language
      };
      
      sessionStorage.setItem('chatbot_last_conversation', JSON.stringify(conversationState));
      console.log('Conversation saved successfully');
      return true;
    } catch (error) {
      console.warn('Failed to save conversation state:', error);
      return false;
    }
  }, [language]);

  // Restore conversation from sessionStorage
  const restoreConversation = useCallback(() => {
    try {
      const savedConversation = sessionStorage.getItem('chatbot_last_conversation');
      if (!savedConversation) return null;
      
      const conversationState = JSON.parse(savedConversation);
      
      // Check if conversation is recent (within last hour)
      const savedTime = new Date(conversationState.timestamp);
      const currentTime = new Date();
      const timeDiff = currentTime - savedTime;
      const oneHour = 60 * 60 * 1000;
      
      if (timeDiff < oneHour && conversationState.messages.length > 1) {
        return conversationState;
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to restore conversation:', error);
      return null;
    }
  }, []);

  // Clear saved conversation
  const clearSavedConversation = useCallback(() => {
    try {
      sessionStorage.removeItem('chatbot_last_conversation');
      return true;
    } catch (error) {
      console.warn('Failed to clear saved conversation:', error);
      return false;
    }
  }, []);

  // Generate restoration message
  const getRestoreMessage = useCallback(() => {
    return language === 'sw' ? 
      '↩️ Mazungumzo yako ya awali yamerejesha.' : 
      '↩️ Your previous conversation has been restored.';
  }, [language]);

  return {
    saveConversation,
    restoreConversation,
    clearSavedConversation,
    getRestoreMessage
  };
}