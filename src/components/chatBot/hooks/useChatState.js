// ===== 2. CHAT STATE HOOK (hooks/useChatState.js) =====
import { useState, useEffect, useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  restoreConversationState,
  createFreshConversationState,
  getConversationStats,
  detectConversationPatterns
} from '../utils/convo/conversationManager';
import { createFreshServiceContext } from '@/utils/context/serviceContextUtils';

export function useChatState(language) {
  // UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);

  // Service Context State
  const [serviceContext, setServiceContext] = useState(() => createFreshServiceContext());
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [currentDetectionResult, setCurrentDetectionResult] = useState(null);

  // Analytics State
  const [conversationStats, setConversationStats] = useState({});
  const [conversationPatterns, setConversationPatterns] = useState({});
  const [suggestionAnalytics, setSuggestionAnalytics] = useState({
    totalGenerated: 0,
    smartSuggestionsUsed: 0,
    fallbackSuggestionsUsed: 0,
    userInteractionRate: 0
  });

  // Constants
  const [maxMessages] = useState(50);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize conversation state
  useEffect(() => {
    const restoredState = restoreConversationState(language);
    
    if (restoredState) {
      setChatMessages(restoredState.messages);
      setServiceContext(restoredState.serviceContext);
      setActiveService(restoredState.activeService);
      setSuggestions(restoredState.suggestions || chatbotData.prompts[language]);
      setConversationStats(getConversationStats(restoredState.messages, restoredState.serviceContext));
      setConversationPatterns(detectConversationPatterns(restoredState.messages));
    } else {
      const freshState = createFreshConversationState(chatbotData, language);
      setChatMessages(freshState.messages);
      setServiceContext(freshState.serviceContext);
      setActiveService(freshState.activeService);
      setSuggestions(freshState.suggestions);
      setConversationStats(getConversationStats(freshState.messages, freshState.serviceContext));
      setConversationPatterns({});
    }
  }, [language]);

  // Handle chat close with animation
  const handleCloseChat = useCallback((withAnimation = true) => {
    if (withAnimation) {
      setIsClosing(true);
      // Allow animation to complete before actually closing
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300); // Adjust timing to match your CSS animation duration
    } else {
      setIsChatOpen(false);
      setIsClosing(false);
    }
  }, []);

  return {
    isChatOpen,
    setIsChatOpen,
    message,
    setMessage,
    isTyping,
    setIsTyping,
    chatMessages,
    setChatMessages,
    suggestions,
    setSuggestions,
    activeService,
    setActiveService,
    isClosing,
    setIsClosing,
    serviceContext,
    setServiceContext,
    detectionHistory,
    setDetectionHistory,
    currentDetectionResult,
    setCurrentDetectionResult,
    conversationStats,
    setConversationStats,
    conversationPatterns,
    setConversationPatterns,
    suggestionAnalytics,
    setSuggestionAnalytics,
    maxMessages,
    isSmallScreen,
    handleCloseChat // Add this to the return object
  };
}