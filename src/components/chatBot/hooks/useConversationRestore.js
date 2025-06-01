// File: app/components/layout/ChatBot/hooks/useConversationRestore.js
import { useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  restoreConversationState,
  getConversationStats,
  detectConversationPatterns,
  addMessageToConversation
} from '../utils/convo/conversationManager';

export const useConversationRestore = ({
  language,
  setChatMessages,
  setServiceContext,
  setActiveService,
  setSuggestions,
  setConversationStats,
  setConversationPatterns
}
) => {
  const restorePreviousConversation = useCallback(() => {
    const restoredState = restoreConversationState(language);
    
    if (restoredState) {
      setChatMessages(restoredState.messages);
      setServiceContext(restoredState.serviceContext);
      setActiveService(restoredState.activeService);
      setSuggestions(restoredState.suggestions || chatbotData.prompts[language]);
      
      // Update conversation analytics
      setConversationStats(getConversationStats(restoredState.messages, restoredState.serviceContext));
      setConversationPatterns(detectConversationPatterns(restoredState.messages));
      
      // Add restoration message
      const restoreMessage = language === 'sw' ? 
        '↩️ Mazungumzo yako ya awali yamerejesha.' : 
        '↩️ Your previous conversation has been restored.';
      
      setTimeout(() => {
        const restorationMsg = {
          role: 'bot',
          content: restoreMessage,
          isSystemMessage: true
        };
        
        setChatMessages(prev => addMessageToConversation(prev, restorationMsg));
      }, 500);
      
      return true;
    }
    
    return false;
  }, [language, setChatMessages, setServiceContext, setActiveService, setSuggestions, setConversationStats, setConversationPatterns]);

  return { restorePreviousConversation };
};

