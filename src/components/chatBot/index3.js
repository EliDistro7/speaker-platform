// File: app/components/layout/ChatBot/index.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, MessageCircle, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { chatbotData } from '@/data/chat/index';
import ChatContainer from './components/ChatContainer';

// Add this import at the top
import { useChatActions } from './hooks/useChatActions';
// **NEW: Import the useMessageSender hook**
import { useMessageSender } from './hooks/sender/useMessageSender';

// Import enhanced service context utilities
import {
  detectServiceFromMessage,
  updateServiceContext,
  generateContextualPrompts,
  generatePricingResponse,
  isPricingInquiry,
  getConversationInsights,
  createFreshServiceContext,
  validateServiceContext
} from '@/utils/context/serviceContextUtils';

// Import existing utility functions from chatBotUtils
import {
  detectLanguage,
  processUserMessage,
  findMatchingService,
  getServiceResponse,
  findFaqMatch,
  isAskingForContact,
  getContactResponse,
  generateSuggestions
} from '@/utils/ChatBotUtils';

// Import the new response generator functions
import {
  generateContextualResponse,
  analyzeMessageIntent,
  validateResponse
} from './utils/response/responseGenerator';

// **NEW IMPORT: Enhanced service detector with confidence scoring**
import {
  detectServiceWithConfidence,
  validateServiceDetection,
  getDetectionSummary
} from './utils/detector/serviceDetector';

// 1. ADD NEW IMPORT at the top of your ChatBot component
import {
  generateSmartSuggestions,
  generateContextualSuggestions,
  generateFollowUpSuggestions,
  generateIndustrySuggestions
} from './utils/suggestion/suggestionEngine';

// 1. ADD NEW IMPORTS (add to existing imports section)
import {
  saveConversationState,
  restoreConversationState,
  clearConversationState,
  createFreshConversationState,
  addMessageToConversation,
  getConversationStats,
  detectConversationPatterns,
  pruneConversation,
  exportConversation
} from './utils/convo/conversationManager';

// Component imports
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import FloatingButton from './FloatingButton';

export default function ChatBot() {
  const pricingData = chatbotData.pricing;
  const { language, setLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // 2. ADD NEW STATE VARIABLES (add to existing useState declarations)
  const [conversationStats, setConversationStats] = useState({});
  const [conversationPatterns, setConversationPatterns] = useState({});
  const [maxMessages] = useState(50); // Configurable message limit
  const [suggestionAnalytics, setSuggestionAnalytics] = useState({
    totalGenerated: 0,
    smartSuggestionsUsed: 0,
    fallbackSuggestionsUsed: 0,
    userInteractionRate: 0
  });

  // Enhanced service context using utility functions
  const [serviceContext, setServiceContext] = useState(() => createFreshServiceContext());
  
  // **NEW STATE: Enhanced service detection results with confidence tracking**
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [currentDetectionResult, setCurrentDetectionResult] = useState(null);
  
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatScrollRef = useRef(null);

  // **NEW: Use the useMessageSender hook instead of defining handleMessageSend inline**
  const { handleMessageSend } = useMessageSender(
    language,
    message,
    setMessage,
    isClosing,
    serviceContext,
    setServiceContext,
    chatMessages,
    setChatMessages,
    setIsTyping,
    setSuggestions,
    setActiveService,
    detectionHistory,
    setDetectionHistory,
    setCurrentDetectionResult,
    setConversationStats,
    setConversationPatterns,
    maxMessages,
    chatEndRef,
    pricingData
  );

  // **NEW: restorePreviousConversation callback for useChatActions**
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
      
      // Add restoration message using utility function
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
  }, [language]);

  // Add this after your state declarations and before your useEffects
  const {
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
    updateConversationAnalytics,
    addMessageWithUpdate
  } = useChatActions({
    language,
    chatMessages,
    serviceContext,
    activeService,
    isClosing,
    isChatOpen,
    setIsClosing,
    setIsChatOpen,
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
    handleMessageSend, // Pass the hook's handleMessageSend
    setMessage,
    isClosing
  }
  );

  // Initialize chat messages when component mounts or language changes
  // 3. REPLACE EXISTING useEffect FOR INITIALIZATION
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
  }, [language]);

  // Auto-scroll to the latest message
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

  // Enhanced close handler with cleanup
  // 4. UPDATE handleCloseChat FUNCTION
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
    
  }, [chatMessages, serviceContext, activeService, language]);

  // Enhanced outside click handler
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
  }, [isChatOpen, isClosing, handleCloseChat]);

  // Keyboard shortcut for closing (ESC key)
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

  // **NEW: Conversation validation effect**
  useEffect(() => {
    // Validate and prune conversation periodically
    setChatMessages(prev => {
      const prunedMessages = pruneConversation(prev, maxMessages);
      
      if (prunedMessages.length !== prev.length) {
        console.log(`Conversation pruned from ${prev.length} to ${prunedMessages.length} messages`);
        
        // Update stats after pruning
        const newStats = getConversationStats(prunedMessages, serviceContext);
        setConversationStats(newStats);
        
        // Auto-save after pruning
        saveConversationState(prunedMessages, serviceContext, activeService, language);
      }
      
      return prunedMessages;
    });
  }, [chatMessages.length, serviceContext, maxMessages, activeService, language]);

  // **NEW: Refresh suggestions when service context changes significantly**
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

  // **NEW: Enhanced service context validation with detection history**
  useEffect(() => {
    if (!validateServiceContext(serviceContext)) {
      console.warn('Invalid service context detected, resetting...');
      setServiceContext(createFreshServiceContext());
    }
    
    // Validate detection history length
    if (detectionHistory.length > 20) {
      setDetectionHistory(prev => prev.slice(-15)); // Keep only last 15
    }
  }, [serviceContext, detectionHistory]);

  // Use useState to track if we're on a small screen
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Update screen size state when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // **NEW: Enhanced debug logging for development**
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Context Updated:', serviceContext);
      if (currentDetectionResult) {
        console.log('Current Detection:', getDetectionSummary(currentDetectionResult));
      }
      if (detectionHistory.length > 0) {
        console.log('Detection History Length:', detectionHistory.length);
        console.log('Recent Detections:', detectionHistory.slice(-3).map(record => ({
          message: record.message.substring(0, 50),
          service: record.detection.service,
          confidence: record.detection.confidence,
          method: record.detection.detectionMethod
        })));
      }
    }
  }, [serviceContext, currentDetectionResult, detectionHistory]);
  
  return (
    <div className="fixed bottom-6 right-6 z-50 sm:z-40" ref={containerRef}>
      {!isChatOpen && (
        <FloatingButton onClick={handleOpenChat} />
      )}
      
      <AnimatePresence>
        {isChatOpen && (
          <ChatContainer 
            isSmallScreen={isSmallScreen}
            isClosing={isClosing}
          >
            {/* **NEW: Enhanced Chat Header with detection confidence indicator */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    {chatbotData.ui.title[language]}
                  </h3>
                  {serviceContext.currentService && (
                    <div className="flex items-center gap-2">
                      <p className="text-blue-300 text-xs opacity-80">
                        {language === 'sw' ? 'Tunazungumza kuhusu' : 'Discussing'}: {serviceContext.currentService}
                      </p>
                      {/* **NEW: Confidence indicator */}
                      {currentDetectionResult && currentDetectionResult.confidence > 0.6 && (
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          currentDetectionResult.confidence > 0.8 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {Math.round(currentDetectionResult.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Minimize button for mobile */}
                {isSmallScreen && (
                  <motion.button
                    onClick={() => handleCloseChat(true)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isClosing}
                  >
                    <Minimize2 className="w-4 h-4" />
                  </motion.button>)}
                
                {/* Close button */}
                <motion.button
                  onClick={() => handleCloseChat(true)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isClosing}
                  title={language === 'sw' ? 'Funga mazungumzo' : 'Close chat'}
                >
                  <X className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                </motion.button>
              </div>
            </div>
            
            <ChatMessages 
              messages={chatMessages}
              isTyping={isTyping}
              chatEndRef={chatEndRef}
              chatScrollRef={chatScrollRef}
              // Enhanced service context for message display
              serviceContext={serviceContext}
              insights={getConversationInsights(serviceContext)}
              // NEW: Pass detection information to messages
              currentDetection={currentDetectionResult}
              detectionHistory={detectionHistory}
            />
            
            <div 
              className="border-t border-gray-700 p-4 space-y-3"
              style={{
                background: 'linear-gradient(0deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)',
                borderTop: '1px solid rgba(55, 65, 81, 0.6)'
              }}
            >
             <QuickPrompts 
                suggestions={suggestions} 
                onSelect={handleQuickPrompt}
                // Enhanced service context for better prompt categorization
                serviceContext={serviceContext}
                conversationDepth={serviceContext.conversationDepth}
                disabled={isClosing}
                // NEW: Pass detection confidence to influence prompt selection
                detectionConfidence={currentDetectionResult?.confidence || 0}
                // **NEW: Smart suggestion engine integration**
                onRegenerateSuggestions={() => {
                  const newSuggestions = generateSmartSuggestions(
                    serviceContext,
                    serviceContext.conversationDepth,
                    language,
                    message,
                    chatMessages,
                    Object.keys(chatbotData.services || {})
                  );
                  setSuggestions(newSuggestions.length > 0 ? newSuggestions : chatbotData.prompts[language]);
                }}
                // **NEW: Industry suggestion handler**
                onIndustrySuggestions={handleIndustrySuggestions}
              />
              
              <ChatInput 
                message={message}
                setMessage={setMessage}
                onSend={handleMessageSend} // Using the hook's handleMessageSend
                inputRef={inputRef}
                placeholder={chatbotData.ui.inputPlaceholder[language]}
                disabled={isClosing}
                // NEW: Add detection-based input hints
                detectionHint={currentDetectionResult?.service ? 
                  (language === 'sw' ? 
                    `Kuhusu ${currentDetectionResult.service} (${Math.round(currentDetectionResult.confidence * 100)}% uhakika)` :
                    `About ${currentDetectionResult.service} (${Math.round(currentDetectionResult.confidence * 100)}% confidence)`
                  ) : null}
              />
              
              {/* Enhanced service context indicator and contact info button */}
              <div className="flex justify-between items-center pt-1">
                {serviceContext.currentService && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="text-blue-400 opacity-70">
                      {language === 'sw' ? 'Tunazungumza kuhusu' : 'Discussing'}: {serviceContext.currentService}
                    </div>
                    {serviceContext.conversationDepth > 3 && (
                      <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {language === 'sw' ? 'Mazungumzo ya kina' : 'Deep conversation'}
                      </div>
                    )}
                  </div>
                )}
                
                <motion.button
                  onClick={handleContactRequest}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isClosing}
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}
                >
                  {chatbotData.ui.contactUs && chatbotData.ui.contactUs[language] ? 
                    chatbotData.ui.contactUs[language] : 
                    (language === "sw" ? "Wasiliana Nasi" : "Contact Us")
                  }
                </motion.button>
              </div>

              {/* Service history indicator */}
              {serviceContext.serviceHistory.length > 1 && (
                <div className="text-xs text-gray-400 opacity-60">
                  {language === 'sw' ? 'Huduma zilizojadiliwa' : 'Services discussed'}: {serviceContext.serviceHistory.join(', ')}
                </div>
              )}

              {/* NEW: Detection method indicator */}
              {currentDetectionResult && (
                <div className="text-xs text-gray-500 opacity-50">
                  {language === 'sw' ? 'Njia ya kugundua' : 'Detection method'}: {currentDetectionResult.detectionMethod}
                </div>
              )}

              {/* ESC hint for desktop */}
              {!isSmallScreen && (
                <div className="text-xs text-gray-500 opacity-50 text-center">
                  {language === 'sw' ? 'Bonyeza ESC kufunga' : 'Press ESC to close'}
                </div>
              )}
            </div>
          </ChatContainer>
        )}
      </AnimatePresence>
    </div>
  );
}