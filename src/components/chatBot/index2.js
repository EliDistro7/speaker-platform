// File: app/components/layout/ChatBot/index.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, MessageCircle, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { chatbotData } from '@/data/chat/index';
import ChatContainer from './components/ChatContainer';

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

// 5. UPDATE restorePreviousConversation FUNCTION
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

// Enhanced handleMessageSend function with full conversation management integration
const handleMessageSend = () => {
  if (!message.trim() || isClosing) return;
  
  const userMessage = message.trim();
  
  // Use detectLanguage utility to detect language from user message
  const detectedLang = detectLanguage(userMessage, null, language);
  
  // **ENHANCED: Use enhanced service detection with confidence scoring**
  const enhancedServiceDetection = detectServiceWithConfidence(
    userMessage, 
    detectedLang, 
    chatbotData.serviceKeywords,
    serviceContext // Pass previous context for contextual detection
  );
  
  // Validate the enhanced detection result
  if (!validateServiceDetection(enhancedServiceDetection)) {
    console.warn('Enhanced service detection failed, falling back to basic detection');
    // Fallback to basic detection if enhanced detection fails
    const basicDetection = detectServiceFromMessage(userMessage, detectedLang);
    enhancedServiceDetection.service = basicDetection.service;
    enhancedServiceDetection.confidence = basicDetection.confidence || 0.5;
    enhancedServiceDetection.matchedTerms = basicDetection.matchedTerms || [];
    enhancedServiceDetection.alternativeServices = [];
    enhancedServiceDetection.detectionMethod = 'fallback_basic';
  }
  
  // **ENHANCED: Update detection history**
  const detectionRecord = {
    message: userMessage,
    timestamp: new Date().toISOString(),
    detection: enhancedServiceDetection,
    language: detectedLang
  };
  
  setDetectionHistory(prev => [...prev.slice(-9), detectionRecord]); // Keep last 10 detections
  setCurrentDetectionResult(enhancedServiceDetection);
  
  // **ENHANCED: Enhanced debug logging for development**
  if (process.env.NODE_ENV === 'development') {
    console.log('Enhanced Service Detection Result:', {
      summary: getDetectionSummary(enhancedServiceDetection),
      fullResult: enhancedServiceDetection,
      detectionHistory: detectionHistory.length
    });
  }
  
  // Analyze message intent using the response generator utility
  const intentAnalysis = analyzeMessageIntent(userMessage, detectedLang);
  
  // **ENHANCED: Enhanced service context update with confidence-based logic**
  let updatedServiceContext;
  if (enhancedServiceDetection.confidence > 0.7) {
    // High confidence: definitely update service context
    updatedServiceContext = updateServiceContext(
      serviceContext, 
      enhancedServiceDetection.service, 
      userMessage
    );
  } else if (enhancedServiceDetection.confidence > 0.4) {
    // Medium confidence: update but preserve previous context influence
    updatedServiceContext = updateServiceContext(
      serviceContext, 
      enhancedServiceDetection.service, 
      userMessage,
      { preservePrevious: true, confidenceThreshold: 0.4 }
    );
  } else {
    // Low confidence: don't change service context, just update conversation
    updatedServiceContext = updateServiceContext(
      serviceContext, 
      null, // Don't change current service
      userMessage
    );
  }
  
  setServiceContext(updatedServiceContext);
  
  // **NEW: Use utility function to add user message with comprehensive metadata**
  const userMessageObj = {
    role: 'user', 
    content: userMessage,
    timestamp: new Date().toISOString(),
    language: detectedLang,
    // Enhanced service detection data
    enhancedDetection: enhancedServiceDetection,
    detectedService: enhancedServiceDetection.service,
    detectionConfidence: enhancedServiceDetection.confidence,
    detectionMethod: enhancedServiceDetection.detectionMethod,
    matchedTerms: enhancedServiceDetection.matchedTerms,
    alternativeServices: enhancedServiceDetection.alternativeServices,
    contextInfluence: enhancedServiceDetection.contextInfluence,
    // Legacy compatibility
    serviceContext: updatedServiceContext.currentService,
    confidence: enhancedServiceDetection.confidence,
    intentAnalysis: intentAnalysis
  };
  
  // **NEW: Add message using conversation manager utility**
  setChatMessages(prev => addMessageToConversation(prev, userMessageObj));
  
  // **NEW: Prune conversation if it gets too long**
  setChatMessages(prev => pruneConversation(prev, maxMessages));
  
  setMessage('');
  setIsTyping(true);
  
  // **ENHANCED: Enhanced language auto-switching with confidence consideration**
  const userMessagesInDetectedLang = chatMessages.filter(
    msg => msg.role === 'user' && msg.language === detectedLang
  ).length;
  
  if (detectedLang !== language && userMessagesInDetectedLang >= 2) {
    console.log(`User consistently using ${detectedLang}, consider switching language`);
    // **ENHANCED: Auto-switch if detection confidence is consistently high**
    const recentHighConfidenceDetections = detectionHistory
      .slice(-3)
      .filter(record => record.language === detectedLang && record.detection.confidence > 0.6);
    
    if (recentHighConfidenceDetections.length >= 2) {
      console.log('High confidence language consistency detected, auto-switching language');
      // Uncomment the line below if you want to auto-switch language
      // setLanguage(detectedLang);
    }
  }
  
  // **NEW: Update conversation stats and patterns after user message**
  setTimeout(() => {
    setChatMessages(currentMessages => {
      const updatedStats = getConversationStats(currentMessages, updatedServiceContext);
      const updatedPatterns = detectConversationPatterns(currentMessages);
      
      setConversationStats(updatedStats);
      setConversationPatterns(updatedPatterns);
      
      return currentMessages;
    });
  }, 100);
  
  // Scroll to bottom immediately after sending message
  setTimeout(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, 50);
  
  // **ENHANCED: Enhanced response generation with confidence-aware processing**
  setTimeout(() => {
    try {
      // **ENHANCED: Use enhanced detection results in response generation**
      const generatedResponse = generateContextualResponse(
        userMessage,
        enhancedServiceDetection, // Pass enhanced detection instead of basic
        intentAnalysis,
        chatbotData,
        detectedLang,
        updatedServiceContext,
        pricingData,

      );

      // ADD THIS:
     // Update service context with last response for contextual follow-ups
     const contextWithLastResponse = {
        ...updatedServiceContext,
  lastResponse: {
    type: generatedResponse.type,
    service: generatedResponse.service,
    text: generatedResponse.text,
    timestamp: new Date().toISOString()
  }
};

setServiceContext(contextWithLastResponse);
      
      // Validate the generated response
      if (!validateResponse(generatedResponse)) {
        console.warn('Generated response validation failed, falling back to enhanced processing');
        throw new Error('Invalid response structure');
      }
      
      // Use the generated response
      let finalResponse = generatedResponse.text;
      let responseMetadata = generatedResponse.metadata || {};
      
      // **ENHANCED: Enhanced metadata with detection details**
      responseMetadata.enhancedDetection = enhancedServiceDetection;
      responseMetadata.detectionSummary = getDetectionSummary(enhancedServiceDetection);
      
      // **ENHANCED: Add confidence-based response enhancement**
      if (enhancedServiceDetection.confidence > 0.8 && enhancedServiceDetection.service) {
        const confidenceNote = detectedLang === 'sw' ? 
          `\n\n✨ Nina uhakika wa ${Math.round(enhancedServiceDetection.confidence * 100)}% kuwa unahitaji msaada wa ${enhancedServiceDetection.service}.` :
          `\n\n✨ I'm ${Math.round(enhancedServiceDetection.confidence * 100)}% confident you need help with ${enhancedServiceDetection.service}.`;
        
        finalResponse += confidenceNote;
      }
      
      // **ENHANCED: Add alternative services suggestion for medium confidence**
      if (enhancedServiceDetection.confidence > 0.4 && 
          enhancedServiceDetection.confidence < 0.7 && 
          enhancedServiceDetection.alternativeServices.length > 0) {
        
        const alternatives = enhancedServiceDetection.alternativeServices
          .slice(0, 2)
          .map(alt => alt.service)
          .join(', ');
        
        const alternativeNote = detectedLang === 'sw' ? 
          `\n\n🤔 Au labda unahitaji msaada wa: ${alternatives}?` :
          `\n\n🤔 Or perhaps you need help with: ${alternatives}?`;
        
        finalResponse += alternativeNote;
      }
      
      // **NEW: Create bot message object with comprehensive metadata**
      const botMessageObj = {
        role: 'bot', 
        content: finalResponse,
        timestamp: new Date().toISOString(),
        language: detectedLang,
        serviceContext: updatedServiceContext.currentService,
        conversationDepth: updatedServiceContext.conversationDepth,
        responseType: generatedResponse.type,
        responseMetadata: responseMetadata,
        insights: getConversationInsights(updatedServiceContext),
        // Enhanced detection metadata
        enhancedDetection: enhancedServiceDetection,
        detectionSummary: getDetectionSummary(enhancedServiceDetection),
        confidenceLevel: enhancedServiceDetection.confidence > 0.8 ? 'high' : 
                        enhancedServiceDetection.confidence > 0.4 ? 'medium' : 'low'
      };
      
      // **NEW: Add bot message using conversation manager and handle auto-save**
      setChatMessages(prev => {
        const updatedMessages = addMessageToConversation(prev, botMessageObj);
        
        // **NEW: Auto-save conversation after bot response**
        saveConversationState(updatedMessages, updatedServiceContext, activeService, detectedLang);
        
        // **NEW: Update stats after bot response**
        const newStats = getConversationStats(updatedMessages, updatedServiceContext);
        const newPatterns = detectConversationPatterns(updatedMessages);
        
        setConversationStats(newStats);
        setConversationPatterns(newPatterns);
        
        return updatedMessages;
      });
      
    // REPLACE THE ABOVE WITH:
// **ENHANCED: Smart suggestion generation using the new suggestion engine**
const smartSuggestions = generateSmartSuggestions(
  updatedServiceContext,
  updatedServiceContext.conversationDepth,
  detectedLang,
  userMessage,
  chatMessages,
  Object.keys(chatbotData.services || {})
);

// **ENHANCED: Generate follow-up suggestions based on bot response**
let followUpSuggestions = [];
if (finalResponse) {
  followUpSuggestions = generateFollowUpSuggestions(
    finalResponse,
    updatedServiceContext.currentService,
    detectedLang,
    updatedServiceContext.conversationDepth
  );
}

// Combine smart suggestions with follow-up suggestions
const contextualPrompts = [
  ...smartSuggestions,
  ...followUpSuggestions.slice(0, 2) // Add up to 2 follow-up suggestions
].slice(0, 4); // Limit to 4 total suggestions

// Fallback to default if no suggestions generated
const finalSuggestions = contextualPrompts.length > 0 ? 
  contextualPrompts : 
  chatbotData.prompts[detectedLang];

setSuggestions(finalSuggestions);
      
      setSuggestions(contextualPrompts.length > 0 ? contextualPrompts : chatbotData.prompts[detectedLang]);
      
      // **ENHANCED: Enhanced active service setting based on confidence**
      if (generatedResponse.service) {
        setActiveService(generatedResponse.service);
      } else if (enhancedServiceDetection.confidence > 0.6 && enhancedServiceDetection.service) {
        setActiveService(enhancedServiceDetection.service);
      } else if (updatedServiceContext.currentService) {
        setActiveService(updatedServiceContext.currentService);
      }
      
      console.log('Enhanced response generated successfully:', {
        type: generatedResponse.type,
        service: generatedResponse.service,
        confidence: enhancedServiceDetection.confidence,
        method: enhancedServiceDetection.detectionMethod,
        alternatives: enhancedServiceDetection.alternativeServices.length,
        metadata: responseMetadata,
        conversationLength: chatMessages.length + 2, // +2 for user and bot messages just added
        stats: conversationStats
      });
      
    } catch (error) {
      console.error('Error in enhanced response generation, falling back to basic processing:', error);
      
      // **ENHANCED: Enhanced fallback processing with detection results**
      let responseData = processUserMessage(userMessage, chatbotData, detectedLang);
      let finalResponse = responseData.text;
      
      // Enhanced response with service context and pricing information (fallback)
      if (enhancedServiceDetection.service && isPricingInquiry(userMessage, detectedLang)) {
        const pricingResponse = generatePricingResponse(enhancedServiceDetection.service, detectedLang, pricingData);
        finalResponse = pricingResponse;
      } else if (enhancedServiceDetection.service && !isPricingInquiry(userMessage, detectedLang)) {
        const serviceResponse = getServiceResponse(enhancedServiceDetection.service, chatbotData, detectedLang);
        if (serviceResponse && serviceResponse !== responseData.text) {
          finalResponse = serviceResponse;
        }
      }
      
      // Add conversation insights for high engagement (fallback)
      const insights = getConversationInsights(updatedServiceContext);
      if (insights.insights.includes('Deep engagement detected')) {
        const engagementNote = detectedLang === 'sw' ? 
          '\n\n💡 Ninaona una maswali mengi. Je, ungependa kuongea na mtaalamu wetu moja kwa moja?' :
          '\n\n💡 I can see you have many questions. Would you like to speak with our specialist directly?';
        finalResponse += engagementNote;
      }
      
      // **NEW: Enhanced fallback message with detection info using conversation manager**
      const fallbackBotMessageObj = {
        role: 'bot', 
        content: finalResponse,
        timestamp: new Date().toISOString(),
        language: detectedLang,
        serviceContext: updatedServiceContext.currentService,
        conversationDepth: updatedServiceContext.conversationDepth,
        insights: insights,
        fallbackUsed: true,
        // Enhanced detection metadata even in fallback
        enhancedDetection: enhancedServiceDetection,
        detectionSummary: getDetectionSummary(enhancedServiceDetection)
      };

      // ADD THIS BEFORE the setChatMessages call:
// Update service context with fallback response info
const fallbackContextWithLastResponse = {
  ...updatedServiceContext,
  lastResponse: {
    type: 'fallback',
    service: enhancedServiceDetection.service,
    text: finalResponse,
    timestamp: new Date().toISOString()
  }
};

setServiceContext(fallbackContextWithLastResponse);
      
      // **NEW: Add fallback message using conversation manager**
      setChatMessages(prev => {
        const updatedMessages = addMessageToConversation(prev, fallbackBotMessageObj);
        
        // **NEW: Auto-save even on fallback**
        saveConversationState(updatedMessages, updatedServiceContext, activeService, detectedLang);
        
        // **NEW: Update stats after fallback response**
        const newStats = getConversationStats(updatedMessages, updatedServiceContext);
        const newPatterns = detectConversationPatterns(updatedMessages);
        
        setConversationStats(newStats);
        setConversationPatterns(newPatterns);
        
        return updatedMessages;
      });
      
     // **ENHANCED: Smart suggestions even in fallback mode**
const fallbackSuggestions = generateSmartSuggestions(
  updatedServiceContext,
  updatedServiceContext.conversationDepth,
  detectedLang,
  userMessage,
  chatMessages,
  Object.keys(chatbotData.services || {})
);

setSuggestions(fallbackSuggestions.length > 0 ? 
  fallbackSuggestions : 
  (responseData.suggestions || chatbotData.prompts[detectedLang])
);
      setActiveService(enhancedServiceDetection.service || updatedServiceContext.currentService);
    }
    
    setIsTyping(false);
  }, 1500);
};
// **NEW: Additional helper functions for conversation management integration**

// Function to handle conversation export
const handleExportConversation = () => {
  const exportData = exportConversation(
    chatMessages, 
    serviceContext, 
    {
      includeMessages: true,
      includeContext: true,
      includeStats: true,
      includeDetectionHistory: true,
      anonymize: false, // Set to true for privacy
      additionalData: {
        conversationStats,
        conversationPatterns,
        detectionHistory: detectionHistory.slice(-10) // Last 10 detections
      }
    }
  );
  
  // Create download link
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to handle conversation clearing
const handleClearConversation = () => {
  clearConversationState();
  
  // Reset to fresh state
  const freshState = createFreshConversationState(chatbotData, language);
  setChatMessages(freshState.messages);
  setServiceContext(freshState.serviceContext);
  setActiveService(null);
  setSuggestions(freshState.suggestions);
  
  // Reset analytics and detection history
  setConversationStats(getConversationStats(freshState.messages, freshState.serviceContext));
  setConversationPatterns({});
  setDetectionHistory([]);
  setCurrentDetectionResult(null);
  
  console.log('Conversation cleared and reset to fresh state');
};

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

  const handleQuickPrompt = (prompt) => {
    if (isClosing) return;
    setMessage(prompt);
    // Auto-submit the prompt after a brief delay

      // **NEW: Track suggestion analytics**
  setSuggestionAnalytics(prev => ({
    ...prev,
    smartSuggestionsUsed: prev.smartSuggestionsUsed + 1,
    userInteractionRate: ((prev.smartSuggestionsUsed + 1) / (prev.totalGenerated || 1)) * 100
  }));
  
  setMessage(prompt);
  // Auto-submit the prompt after a brief delay
  setTimeout(() => handleMessageSend(), 300);
    
  };

 
  // Enhanced contact information handler
  const handleContactRequest = () => {
    const contactResponse = getContactResponse(chatbotData.contactInfo, language);
    
    // **NEW: Add personalized message based on current detection and service context**
    let personalizedContact = contactResponse;
    if (currentDetectionResult && currentDetectionResult.service && currentDetectionResult.confidence > 0.6) {
      const serviceNote = language === 'sw' ? 
        `\n\n📋 Kwa maswali maalum kuhusu ${currentDetectionResult.service} (nina uhakika wa ${Math.round(currentDetectionResult.confidence * 100)}%), wasiliana nasi moja kwa moja.` :
        `\n\n📋 For specific questions about ${currentDetectionResult.service} (${Math.round(currentDetectionResult.confidence * 100)}% confidence), contact us directly.`;
      personalizedContact += serviceNote;
    } else if (serviceContext.currentService) {
      const serviceNote = language === 'sw' ? 
        `\n\n📋 Kwa maswali maalum kuhusu ${serviceContext.currentService}, wasiliana nasi moja kwa moja.` :
        `\n\n📋 For specific questions about ${serviceContext.currentService}, contact us directly.`;
      personalizedContact += serviceNote;
    }
    
    setChatMessages(prev => [...prev, { 
      role: 'bot', 
      content: personalizedContact,
      timestamp: new Date().toISOString(),
      trigger: 'contact_request',
      serviceContext: serviceContext.currentService,
      enhancedDetection: currentDetectionResult // **NEW: Include current detection**
    }]);
  };

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

  // Handle opening chat with optional conversation restoration
 // REPLACE WITH:
const handleOpenChat = () => {
  setIsChatOpen(true);
  
  // Try to restore previous conversation
  setTimeout(() => {
    const restored = restorePreviousConversation();
    if (!restored) {
      // If no conversation was restored, show fresh welcome message
      setChatMessages([{ role: 'bot', content: chatbotData.welcome[language] }]);
      
      // **ENHANCED: Generate smart initial suggestions**
      const initialSuggestions = generateSmartSuggestions(
        createFreshServiceContext(),
        0, // Initial conversation depth
        language,
        '', // No user message yet
        [], // No chat history yet
        Object.keys(chatbotData.services || {})
      );
      
      setSuggestions(initialSuggestions.length > 0 ? 
        initialSuggestions : 
        chatbotData.prompts[language]
      );
    }
  }, 300);
};

// **NEW: Industry-specific suggestion handler**
const handleIndustrySuggestions = (industry) => {
  const industrySuggestions = generateIndustrySuggestions(industry, language);
  
  if (industrySuggestions.length > 0) {
    setSuggestions(prev => [
      ...industrySuggestions,
      ...prev.slice(0, 2) // Keep some existing suggestions
    ].slice(0, 4));
  }
};


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
                onSend={handleMessageSend}
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