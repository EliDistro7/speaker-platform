// File: app/components/layout/ChatBot/hooks/useChatActions.js
import { useCallback, useMemo, useRef } from 'react';
import { chatbotData } from '@/data/chat/index';
import { getContactResponse } from '@/utils/ChatBotUtils';

import {
  clearConversationState,
  createFreshConversationState,
  exportConversation,
  getConversationStats,
  restoreConversationState,
  saveConversationState,
  addMessageToConversation,
  detectConversationPatterns
} from '../utils/convo/conversationManager';
import {
  generateSmartSuggestions,
  generateIndustrySuggestions
} from '../utils/suggestion/suggestionEngine';

export const useChatActions = ({
  language,
  chatMessages,
  setIsClosing,
  setIsChatOpen,
  isChatOpen,
  isClosing,
  serviceContext,
  activeService,
  currentDetectionResult,
  conversationStats,
  conversationPatterns,
  detectionHistory,
  setChatMessages,
  setServiceContext,
  setActiveService,
  setSuggestions,
  setConversationStats,
  setConversationPatterns,
  setDetectionHistory,
  setCurrentDetectionResult,
  setSuggestionAnalytics,
  restorePreviousConversation,
  handleMessageSend,
  setMessage,

}) => {
  
  // Use refs to store latest values without causing re-renders
  const latestStateRef = useRef({
    chatMessages,
    serviceContext,
    activeService,
    currentDetectionResult,
    conversationStats,
    conversationPatterns,
    detectionHistory
  });

  // Update refs when values change
  latestStateRef.current = {
    chatMessages,
    serviceContext,
    activeService,
    currentDetectionResult,
    conversationStats,
    conversationPatterns,
    detectionHistory
  };

  // Memoize frequently used selectors
  const memoizedSelectors = useMemo(() => ({
    availableServices: Object.keys(chatbotData.services || {}),
    currentService: serviceContext.currentService,
    conversationDepth: serviceContext.conversationDepth,
    hasDetectionResult: currentDetectionResult && currentDetectionResult.confidence > 0.6,
    messageCount: chatMessages.length
  }), [
    serviceContext.currentService,
    serviceContext.conversationDepth,
    currentDetectionResult?.confidence,
    chatMessages.length
  ]);

  // Optimize analytics update function with batching
  const updateAnalytics = useCallback((messages = null, context = null) => {
    const messagesToUse = messages || latestStateRef.current.chatMessages;
    const contextToUse = context || latestStateRef.current.serviceContext;
    
    const newStats = getConversationStats(messagesToUse, contextToUse);
    const newPatterns = detectConversationPatterns(messagesToUse);
    
    // Batch state updates
    setConversationStats(newStats);
    setConversationPatterns(newPatterns);
    
    return { stats: newStats, patterns: newPatterns };
  }, []); // No dependencies since we use refs

  // Optimize suggestion analytics tracking
  const trackSuggestionUsage = useCallback((suggestionType, used = true) => {
    setSuggestionAnalytics(prev => {
      if (!used) return prev;
      
      const updates = {
        smart: () => ({ smartSuggestionsUsed: prev.smartSuggestionsUsed + 1 }),
        fallback: () => ({ fallbackSuggestionsUsed: prev.fallbackSuggestionsUsed + 1 }),
        industry: () => ({ industrySuggestionsUsed: (prev.industrySuggestionsUsed || 0) + 1 })
      };
      
      const update = updates[suggestionType];
      if (!update) return prev;
      
      const updatedFields = update();
      const totalUsed = (updatedFields.smartSuggestionsUsed || prev.smartSuggestionsUsed) + 
                       (updatedFields.fallbackSuggestionsUsed || prev.fallbackSuggestionsUsed) + 
                       (updatedFields.industrySuggestionsUsed || prev.industrySuggestionsUsed || 0);
      
      return {
        ...prev,
        ...updatedFields,
        userInteractionRate: (totalUsed / (prev.totalGenerated || 1)) * 100
      };
    });
  }, [setSuggestionAnalytics]);

  // Handle quick prompt selection with optimized flow
  const handleQuickPrompt = useCallback((prompt) => {
    if (isClosing) return;
    
    // Track usage immediately
    trackSuggestionUsage('smart', true);
    
    setMessage(prompt);
    
    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      setTimeout(() => handleMessageSend(), 100);
    });
  }, [trackSuggestionUsage, setMessage, handleMessageSend, isClosing]);

  // Enhanced contact information handler with better performance
  const handleContactRequest = useCallback(() => {
    const { currentDetectionResult, serviceContext, chatMessages, activeService } = latestStateRef.current;
    
    let personalizedContact = getContactResponse(chatbotData.contactInfo, language);
    
    // Optimize condition checks
    const hasConfidentDetection = currentDetectionResult?.service && currentDetectionResult.confidence > 0.6;
    const serviceToReference = hasConfidentDetection ? 
      currentDetectionResult.service : 
      serviceContext.currentService;
    
    if (serviceToReference) {
      const serviceNote = language === 'sw' ? 
        `\n\n📋 Kwa maswali maalum kuhusu ${serviceToReference}${hasConfidentDetection ? ` (nina uhakika wa ${Math.round(currentDetectionResult.confidence * 100)}%)` : ''}, wasiliana nasi moja kwa moja.` :
        `\n\n📋 For specific questions about ${serviceToReference}${hasConfidentDetection ? ` (${Math.round(currentDetectionResult.confidence * 100)}% confidence)` : ''}, contact us directly.`;
      personalizedContact += serviceNote;
    }
    
    const newMessage = { 
      role: 'bot', 
      content: personalizedContact,
      timestamp: new Date().toISOString(),
      trigger: 'contact_request',
      serviceContext: serviceContext.currentService,
      enhancedDetection: currentDetectionResult
    };
    
    // Batch operations
    const updatedMessages = addMessageToConversation(chatMessages, newMessage);
    setChatMessages(updatedMessages);
    
    // Update analytics and save in one go
    requestAnimationFrame(() => {
      updateAnalytics(updatedMessages, serviceContext);
      saveConversationState(updatedMessages, serviceContext, activeService, language);
    });
  }, [language, setChatMessages, updateAnalytics]);

  // Optimized conversation export
  const handleExportConversation = useCallback(() => {
    const { chatMessages, serviceContext, conversationStats, conversationPatterns, detectionHistory } = latestStateRef.current;
    
    const exportData = exportConversation(
      chatMessages, 
      serviceContext, 
      {
        includeMessages: true,
        includeContext: true,
        includeStats: true,
        includeDetectionHistory: true,
        anonymize: false,
        additionalData: {
          conversationStats,
          conversationPatterns,
          detectionHistory: detectionHistory.slice(-10)
        }
      }
    );
    
    // Use more efficient download method
    const dataStr = JSON.stringify(exportData, null, 2);
    const url = URL.createObjectURL(new Blob([dataStr], { type: 'application/json' }));
    
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: `chat-export-${new Date().toISOString().split('T')[0]}.json`,
      style: 'display: none'
    });
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Streamlined conversation clearing
  const handleClearConversation = useCallback(() => {
    clearConversationState();
    
    const freshState = createFreshConversationState(chatbotData, language);
    const initialStats = getConversationStats(freshState.messages, freshState.serviceContext);
    
    // Batch all state updates
    setChatMessages(freshState.messages);
    setServiceContext(freshState.serviceContext);
    setActiveService(null);
    setSuggestions(freshState.suggestions);
    setConversationStats(initialStats);
    setConversationPatterns({});
    setDetectionHistory([]);
    setCurrentDetectionResult(null);
    setSuggestionAnalytics({
      totalGenerated: 0,
      smartSuggestionsUsed: 0,
      fallbackSuggestionsUsed: 0,
      userInteractionRate: 0
    });
    
    console.log('Conversation cleared and reset to fresh state');
  }, [
    language,
    setChatMessages,
    setServiceContext,
    setActiveService,
    setSuggestions,
    setConversationStats,
    setConversationPatterns,
    setDetectionHistory,
    setCurrentDetectionResult,
    setSuggestionAnalytics
  ]);

// FIXED VERSION - The key missing line is setIsChatOpen(true)
const handleOpenChat = useCallback(() => {
  // First, immediately open the chat
  setIsChatOpen(true);
  setIsClosing(false);
  
  // Then handle the restoration/initialization
  requestAnimationFrame(() => {
    setTimeout(() => {
      const restored = restorePreviousConversation();
      
      if (!restored) {
        const welcomeMessage = { 
          role: 'bot', 
          content: chatbotData.welcome[language],
          timestamp: new Date().toISOString(),
          language: language
        };
        
        setChatMessages([welcomeMessage]);
        
        const freshContext = createFreshConversationState(chatbotData, language).serviceContext;
        const initialSuggestions = generateSmartSuggestions(
          freshContext,
          0,
          language,
          '',
          [welcomeMessage],
          memoizedSelectors.availableServices
        );
        
        setSuggestions(initialSuggestions.length > 0 ? 
          initialSuggestions : 
          chatbotData.prompts[language]
        );
        
        setConversationStats(getConversationStats([welcomeMessage], freshContext));
      }
    }, 100);
  });
}, [
  restorePreviousConversation, 
  setChatMessages, 
  setSuggestions, 
  setConversationStats, 
  language, 
  memoizedSelectors.availableServices,
  setIsChatOpen, // Add this to dependencies
  setIsClosing   // Add this to dependencies
]);

// ALTERNATIVE SIMPLER VERSION for immediate testing:
const handleOpenChatSimple = useCallback(() => {
  console.log('Opening chat...');
  setIsChatOpen(true);
  setIsClosing(false);
  
  // Do the restoration/initialization after chat is visible
  setTimeout(() => {
    const restored = restorePreviousConversation();
    
    if (!restored) {
      const welcomeMessage = { 
        role: 'bot', 
        content: chatbotData.welcome[language],
        timestamp: new Date().toISOString(),
        language: language
      };
      
      setChatMessages([welcomeMessage]);
      setSuggestions(chatbotData.prompts[language]);
    }
  }, 50);
}, [restorePreviousConversation, setChatMessages, setSuggestions, language]);

// DEBUGGING VERSION to see what's happening:
const handleOpenChatDebug = useCallback(() => {
  console.log('handleOpenChat called');
  console.log('Current isChatOpen:', isChatOpen);
  console.log('Current isClosing:', isClosing);
  
  setIsChatOpen(true);
  setIsClosing(false);
  
  console.log('Set isChatOpen to true');
  
  // Verify state change
  setTimeout(() => {
    console.log('After timeout - isChatOpen should be true');
  }, 100);
}, [isChatOpen, isClosing]);
  // Optimized industry suggestions handler
  const handleIndustrySuggestions = useCallback((industry) => {
    const industrySuggestions = generateIndustrySuggestions(industry, language);
    
    if (industrySuggestions.length > 0) {
      setSuggestions(prev => [
        ...industrySuggestions.slice(0, 3), // Limit new suggestions
        ...prev.slice(0, 1) // Keep only one existing suggestion
      ]);
      
      setSuggestionAnalytics(prev => ({
        ...prev,
        totalGenerated: prev.totalGenerated + industrySuggestions.length,
        industrySuggestionsUsed: (prev.industrySuggestionsUsed || 0)
      }));
    }
  }, [language, setSuggestions, setSuggestionAnalytics]);

  // Optimized suggestion regeneration
  const handleRegenerateSuggestions = useCallback(() => {
    const { serviceContext, chatMessages } = latestStateRef.current;
    
    const newSuggestions = generateSmartSuggestions(
      serviceContext,
      serviceContext.conversationDepth,
      language,
      '',
      chatMessages,
      memoizedSelectors.availableServices
    );
    
    const suggestionsToUse = newSuggestions.length > 0 ? newSuggestions : chatbotData.prompts[language];
    
    setSuggestions(suggestionsToUse);
    setSuggestionAnalytics(prev => ({
      ...prev,
      totalGenerated: prev.totalGenerated + suggestionsToUse.length
    }));
  }, [language, setSuggestions, setSuggestionAnalytics, memoizedSelectors.availableServices]);

  // Simplified conversation saving
  const handleSaveConversation = useCallback(() => {
    const { chatMessages, serviceContext, activeService } = latestStateRef.current;
    
    const saveSuccess = saveConversationState(chatMessages, serviceContext, activeService, language);
    
    if (saveSuccess) {
      console.log('Conversation saved successfully');
    } else {
      console.error('Failed to save conversation');
    }
    
    return saveSuccess;
  }, [language]);

  // Optimized insights getter with memoization
  const getInsights = useCallback(() => {
    const { 
      chatMessages, 
      serviceContext, 
      detectionHistory 
    } = latestStateRef.current;
    
    const averageConfidence = detectionHistory.length > 0 ? 
      detectionHistory.reduce((acc, curr) => acc + curr.detection.confidence, 0) / detectionHistory.length : 0;
    
    const conversationDuration = chatMessages.length > 0 && chatMessages[0].timestamp ? 
      Date.now() - new Date(chatMessages[0].timestamp).getTime() : 0;
    
    return {
      messageCount: chatMessages.length,
      serviceDiscussed: serviceContext.currentService,
      conversationDepth: serviceContext.conversationDepth,
      detectionAccuracy: averageConfidence,
      topServices: serviceContext.serviceHistory,
      conversationDuration,
      patterns: conversationPatterns,
      stats: conversationStats
    };
  }, [conversationPatterns, conversationStats]);

  // Optimized message addition with better performance
  const addMessageWithUpdate = useCallback((newMessage, options = {}) => {
    const { chatMessages, serviceContext, activeService } = latestStateRef.current;
    
    const updatedMessages = addMessageToConversation(chatMessages, newMessage, options);
    setChatMessages(updatedMessages);
    
    // Defer analytics updates to next frame for better performance
    requestAnimationFrame(() => {
      updateAnalytics(updatedMessages, serviceContext);
      
      // Auto-save with debouncing
      if (options.autoSave !== false) {
        saveConversationState(updatedMessages, serviceContext, activeService, language);
      }
    });
    
    return updatedMessages;
  }, [language, setChatMessages, updateAnalytics]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // Core action handlers
    handleQuickPrompt,
    handleContactRequest,
    handleOpenChat,
    
    // Conversation management
    handleExportConversation,
    handleClearConversation,
    handleSaveConversation,
    
    // Suggestion management
    handleIndustrySuggestions,
    handleRegenerateSuggestions,
    trackSuggestionUsage,
    
    // Analytics and insights
    getInsights,
    updateConversationAnalytics: updateAnalytics,
    addMessageWithUpdate
  }), [
    handleQuickPrompt,
    handleContactRequest,
    handleOpenChat,
    handleExportConversation,
    handleClearConversation,
    handleSaveConversation,
    handleIndustrySuggestions,
    handleRegenerateSuggestions,
    trackSuggestionUsage,
    getInsights,
    updateAnalytics,
    addMessageWithUpdate
  ]);
};

export default useChatActions;