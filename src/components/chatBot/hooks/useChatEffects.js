// ===== 3. CHAT EFFECTS HOOK (hooks/useChatEffects.js) =====
import { useEffect, useCallback } from 'react';
import {
  saveConversationState,
  pruneConversation,
  getConversationStats
} from '../utils/convo/conversationManager';
import {
  validateServiceContext,
  createFreshServiceContext
} from '@/utils/context/serviceContextUtils';
import {
  generateContextualSuggestions
} from '../utils/suggestion/suggestionEngine';

export function useChatEffects({
  language,
  isChatOpen,
  chatMessages,
  isTyping,
  serviceContext,
  activeService,
  isClosing,
  containerRef,
  chatEndRef,
  inputRef,
  chatScrollRef,
  handleCloseChat,
  setChatMessages,
  setServiceContext,
  setActiveService,
  setSuggestions,
  setConversationStats,
  setConversationPatterns,
  setDetectionHistory,
  currentDetectionResult,
  detectionHistory,
  maxMessages
}) {
  
  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current && chatScrollRef.current) {
      setTimeout(() => {
        chatEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  }, [chatMessages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isChatOpen]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && 
          !containerRef.current.contains(event.target) && 
          isChatOpen && 
          !isClosing) {
        setTimeout(() => {
          if (isChatOpen && !isClosing) {
            handleCloseChat(true);
          }
        }, 100);
      }
    };

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen, isClosing, handleCloseChat]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isChatOpen && !isClosing) {
        event.preventDefault();
        handleCloseChat(true);
      }
    };

    if (isChatOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChatOpen, isClosing, handleCloseChat]);

  // Conversation validation and pruning
  useEffect(() => {
    setChatMessages(prev => {
      const prunedMessages = pruneConversation(prev, maxMessages);
      
      if (prunedMessages.length !== prev.length) {
        const newStats = getConversationStats(prunedMessages, serviceContext);
        setConversationStats(newStats);
        saveConversationState(prunedMessages, serviceContext, activeService, language);
      }
      
      return prunedMessages;
    });
  }, [chatMessages.length, serviceContext, maxMessages, activeService, language]);

  // Refresh suggestions when service context changes
  useEffect(() => {
    if (serviceContext.currentService && chatMessages.length > 0) {
      const contextualSuggestions = generateContextualSuggestions(
        serviceContext.currentService,
        serviceContext.conversationDepth,
        language,
        serviceContext
      );
      
      if (contextualSuggestions.length > 0) {
        setSuggestions(contextualSuggestions);
      }
    }
  }, [serviceContext.currentService, serviceContext.conversationDepth, language]);

  // Service context validation
  useEffect(() => {
    if (!validateServiceContext(serviceContext)) {
      console.warn('Invalid service context detected, resetting...');
      setServiceContext(createFreshServiceContext());
    }
    
    if (detectionHistory.length > 20) {
      setDetectionHistory(prev => prev.slice(-15));
    }
  }, [serviceContext, detectionHistory]);

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Context Updated:', serviceContext);
      if (currentDetectionResult) {
        console.log('Current Detection:', currentDetectionResult);
      }
    }
  }, [serviceContext, currentDetectionResult, detectionHistory]);
}