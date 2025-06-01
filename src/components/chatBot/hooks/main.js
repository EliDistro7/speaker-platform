// File: app/components/layout/ChatBot/hooks/useChatState.js
import { useState, useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import { createFreshServiceContext, createFreshConversationState } from '@/utils/serviceContextUtils';

export const useChatState = (language) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  
  // Service context state
  const [serviceContext, setServiceContext] = useState(() => createFreshServiceContext());
  
  // Enhanced detection state
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [currentDetectionResult, setCurrentDetectionResult] = useState(null);
  
  // Conversation analytics state
  const [conversationStats, setConversationStats] = useState({});
  const [conversationPatterns, setConversationPatterns] = useState({});
  const [maxMessages] = useState(50);
  const [suggestionAnalytics, setSuggestionAnalytics] = useState({
    totalGenerated: 0,
    smartSuggestionsUsed: 0,
    fallbackSuggestionsUsed: 0,
    userInteractionRate: 0
  });

  const resetChatState = useCallback(() => {
    const freshState = createFreshConversationState(chatbotData, language);
    setChatMessages(freshState.messages);
    setServiceContext(freshState.serviceContext);
    setActiveService(null);
    setSuggestions(freshState.suggestions);
    setConversationStats({});
    setConversationPatterns({});
    setDetectionHistory([]);
    setCurrentDetectionResult(null);
  }, [language]);

  return {
    // Basic chat state
    isChatOpen, setIsChatOpen,
    message, setMessage,
    isTyping, setIsTyping,
    chatMessages, setChatMessages,
    suggestions, setSuggestions,
    activeService, setActiveService,
    isClosing, setIsClosing,
    
    // Service context state
    serviceContext, setServiceContext,
    
    // Detection state
    detectionHistory, setDetectionHistory,
    currentDetectionResult, setCurrentDetectionResult,
    
    // Analytics state
    conversationStats, setConversationStats,
    conversationPatterns, setConversationPatterns,
    maxMessages,
    suggestionAnalytics, setSuggestionAnalytics,
    
    // Actions
    resetChatState
  };
};

// File: app/components/layout/ChatBot/hooks/useChatInitialization.js
import { useEffect } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  restoreConversationState,
  createFreshConversationState,
  getConversationStats,
  detectConversationPatterns
} from '../utils/convo/conversationManager';

export const useChatInitialization = (
  language,
  setChatMessages,
  setServiceContext,
  setActiveService,
  setSuggestions,
  setConversationStats,
  setConversationPatterns
) => {
  useEffect(() => {
    // Try to restore conversation first
    const restoredState = restoreConversationState(language);
    
    if (restoredState) {
      setChatMessages(restoredState.messages);
      setServiceContext(restoredState.serviceContext);
      setActiveService(restoredState.activeService);
      setSuggestions(restoredState.suggestions || chatbotData.prompts[language]);
      
      // Update stats and patterns from restored conversation
      setConversationStats(getConversationStats(restoredState.messages, restoredState.serviceContext));
      setConversationPatterns(detectConversationPatterns(restoredState.messages));
      
      console.log('Conversation restored from storage');
    } else {
      // Create fresh conversation state
      const freshState = createFreshConversationState(chatbotData, language);
      setChatMessages(freshState.messages);
      setServiceContext(freshState.serviceContext);
      setActiveService(freshState.activeService);
      setSuggestions(freshState.suggestions);
      
      // Initialize stats for fresh conversation
      setConversationStats(getConversationStats(freshState.messages, freshState.serviceContext));
      setConversationPatterns({});
    }
  }, [language, setChatMessages, setServiceContext, setActiveService, setSuggestions, setConversationStats, setConversationPatterns]);
};

// File: app/components/layout/ChatBot/hooks/useChatAutoScroll.js
import { useEffect } from 'react';

export const useChatAutoScroll = (chatMessages, isTyping, chatEndRef, chatScrollRef) => {
  useEffect(() => {
    if (chatEndRef.current && chatScrollRef.current) {
      setTimeout(() => {
        chatEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  }, [chatMessages, isTyping, chatEndRef, chatScrollRef]);
};

// File: app/components/layout/ChatBot/hooks/useChatFocus.js
import { useEffect } from 'react';

export const useChatFocus = (isChatOpen, inputRef) => {
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isChatOpen, inputRef]);
};

// File: app/components/layout/ChatBot/hooks/useChatCloseHandler.js
import { useCallback } from 'react';
import { saveConversationState } from '../utils/convo/conversationManager';

export const useChatCloseHandler = (
  chatMessages,
  serviceContext,
  activeService,
  language,
  setIsClosing,
  setIsTyping,
  setMessage,
  setIsChatOpen
) => {
  const handleCloseChat = useCallback((shouldSave = false) => {
    setIsClosing(true);
    
    // Save conversation state using utility function
    if (shouldSave && chatMessages.length > 1) {
      const saveSuccess = saveConversationState(
        chatMessages, 
        serviceContext, 
        activeService, 
        language
      );
      
      if (saveSuccess) {
        console.log('Conversation saved successfully');
      }
    }
    
    // Clear typing state and reset message input
    setIsTyping(false);
    setMessage('');
    
    // Close chat with animation delay
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 200);
    
  }, [chatMessages, serviceContext, activeService, language, setIsClosing, setIsTyping, setMessage, setIsChatOpen]);

  return { handleCloseChat };
};

// File: app/components/layout/ChatBot/hooks/useChatKeyboardShortcuts.js
import { useEffect } from 'react';

export const useChatKeyboardShortcuts = (isChatOpen, isClosing, handleCloseChat) => {
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
};

// File: app/components/layout/ChatBot/hooks/useChatOutsideClick.js
import { useEffect } from 'react';

export const useChatOutsideClick = (containerRef, isChatOpen, isClosing, handleCloseChat) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && 
          !containerRef.current.contains(event.target) && 
          isChatOpen && 
          !isClosing) {
        
        // Add a small delay to prevent accidental closes
        setTimeout(() => {
          if (isChatOpen && !isClosing) {
            handleCloseChat(true); // Save conversation when closing via outside click
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
  }, [containerRef, isChatOpen, isClosing, handleCloseChat]);
};

// File: app/components/layout/ChatBot/hooks/useScreenSize.js
import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isSmallScreen };
};

// File: app/components/layout/ChatBot/hooks/useConversationRestore.js
import { useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  restoreConversationState,
  getConversationStats,
  detectConversationPatterns,
  addMessageToConversation
} from '../utils/convo/conversationManager';

export const useConversationRestore = (
  language,
  setChatMessages,
  setServiceContext,
  setActiveService,
  setSuggestions,
  setConversationStats,
  setConversationPatterns
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

