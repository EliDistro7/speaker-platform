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
} from '@/utils/serviceContextUtils';

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
} from './utils/responseGenerator';

// **NEW IMPORT: Enhanced service detector with confidence scoring**
import {
  detectServiceWithConfidence,
  validateServiceDetection,
  getDetectionSummary
} from './utils/serviceDetector';

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
  useEffect(() => {
    setChatMessages([
      { role: 'bot', content: chatbotData.welcome[language] }
    ]);
    setSuggestions(chatbotData.prompts[language]);
    // Reset service context when language changes
    setServiceContext(createFreshServiceContext());
    // **NEW: Reset detection history when language changes**
    setDetectionHistory([]);
    setCurrentDetectionResult(null);
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
  const handleCloseChat = useCallback((shouldSave = false) => {
    setIsClosing(true);
    
    // Optional: Save conversation state before closing
    if (shouldSave && chatMessages.length > 1) {
      try {
        const conversationState = {
          messages: chatMessages,
          serviceContext: serviceContext,
          activeService: activeService,
          detectionHistory: detectionHistory, // **NEW: Save detection history**
          currentDetectionResult: currentDetectionResult, // **NEW: Save current detection**
          timestamp: new Date().toISOString(),
          language: language
        };
        
        // Store in sessionStorage for potential restoration
        sessionStorage.setItem('chatbot_last_conversation', JSON.stringify(conversationState));
        
        console.log('Conversation saved before closing');
      } catch (error) {
        console.warn('Failed to save conversation state:', error);
      }
    }
    
    // Clear typing state
    setIsTyping(false);
    
    // Reset message input
    setMessage('');
    
    // Close chat with animation delay
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 200);
    
  }, [chatMessages, serviceContext, activeService, language, detectionHistory, currentDetectionResult]);

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

  // **NEW: Enhanced restoration with detection history**
  const restorePreviousConversation = useCallback(() => {
    try {
      const savedConversation = sessionStorage.getItem('chatbot_last_conversation');
      if (savedConversation) {
        const conversationState = JSON.parse(savedConversation);
        
        // Check if conversation is recent (within last hour)
        const savedTime = new Date(conversationState.timestamp);
        const currentTime = new Date();
        const timeDiff = currentTime - savedTime;
        const oneHour = 60 * 60 * 1000;
        
        if (timeDiff < oneHour && conversationState.messages.length > 1) {
          setChatMessages(conversationState.messages);
          setServiceContext(conversationState.serviceContext || createFreshServiceContext());
          setActiveService(conversationState.activeService);
          
          // **NEW: Restore detection history and current detection**
          if (conversationState.detectionHistory) {
            setDetectionHistory(conversationState.detectionHistory);
          }
          if (conversationState.currentDetectionResult) {
            setCurrentDetectionResult(conversationState.currentDetectionResult);
          }
          
          // Add restoration message
          const restoreMessage = language === 'sw' ? 
            '↩️ Mazungumzo yako ya awali yamerejesha.' : 
            '↩️ Your previous conversation has been restored.';
          
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              role: 'bot',
              content: restoreMessage,
              timestamp: new Date().toISOString(),
              isSystemMessage: true
            }]);
          }, 500);
          
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to restore conversation:', error);
    }
    return false;
  }, [language]);

  // **MAIN ENHANCEMENT: Enhanced message processing with advanced service detection**
  const handleMessageSend = () => {
    if (!message.trim() || isClosing) return;
    
    const userMessage = message.trim();
    
    // Use detectLanguage utility to detect language from user message
    const detectedLang = detectLanguage(userMessage, null, language);
    
    // **NEW: Use enhanced service detection with confidence scoring**
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
    
    // **NEW: Update detection history**
    const detectionRecord = {
      message: userMessage,
      timestamp: new Date().toISOString(),
      detection: enhancedServiceDetection,
      language: detectedLang
    };
    
    setDetectionHistory(prev => [...prev.slice(-9), detectionRecord]); // Keep last 10 detections
    setCurrentDetectionResult(enhancedServiceDetection);
    
    // **NEW: Enhanced debug logging for development**
    if (process.env.NODE_ENV === 'development') {
      console.log('Enhanced Service Detection Result:', {
        summary: getDetectionSummary(enhancedServiceDetection),
        fullResult: enhancedServiceDetection,
        detectionHistory: detectionHistory.length
      });
    }
    
    // Analyze message intent using the response generator utility
    const intentAnalysis = analyzeMessageIntent(userMessage, detectedLang);
    
    // **NEW: Enhanced service context update with confidence-based logic**
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
    
    // **NEW: Enhanced user message with comprehensive detection metadata**
    setChatMessages(prev => [...prev, { 
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
    }]);
    
    setMessage('');
    setIsTyping(true);
    
    // **NEW: Enhanced language auto-switching with confidence consideration**
    const userMessagesInDetectedLang = chatMessages.filter(
      msg => msg.role === 'user' && msg.language === detectedLang
    ).length;
    
    if (detectedLang !== language && userMessagesInDetectedLang >= 2) {
      console.log(`User consistently using ${detectedLang}, consider switching language`);
      // **NEW: Auto-switch if detection confidence is consistently high**
      const recentHighConfidenceDetections = detectionHistory
        .slice(-3)
        .filter(record => record.language === detectedLang && record.detection.confidence > 0.6);
      
      if (recentHighConfidenceDetections.length >= 2) {
        console.log('High confidence language consistency detected, auto-switching language');
        // Uncomment the line below if you want to auto-switch language
        // setLanguage(detectedLang);
      }
    }
    
    // Scroll to bottom immediately after sending message
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
    
    // **NEW: Enhanced response generation with confidence-aware processing**
    setTimeout(() => {
      try {
        // **NEW: Use enhanced detection results in response generation**
        const generatedResponse = generateContextualResponse(
          userMessage,
          enhancedServiceDetection, // Pass enhanced detection instead of basic
          intentAnalysis,
          chatbotData,
          detectedLang,
          updatedServiceContext,
          pricingData
        );
        
        // Validate the generated response
        if (!validateResponse(generatedResponse)) {
          console.warn('Generated response validation failed, falling back to enhanced processing');
          throw new Error('Invalid response structure');
        }
        
        // Use the generated response
        let finalResponse = generatedResponse.text;
        let responseMetadata = generatedResponse.metadata || {};
        
        // **NEW: Enhanced metadata with detection details**
        responseMetadata.enhancedDetection = enhancedServiceDetection;
        responseMetadata.detectionSummary = getDetectionSummary(enhancedServiceDetection);
        
        // **NEW: Add confidence-based response enhancement**
        if (enhancedServiceDetection.confidence > 0.8 && enhancedServiceDetection.service) {
          const confidenceNote = detectedLang === 'sw' ? 
            `\n\n✨ Nina uhakika wa ${Math.round(enhancedServiceDetection.confidence * 100)}% kuwa unahitaji msaada wa ${enhancedServiceDetection.service}.` :
            `\n\n✨ I'm ${Math.round(enhancedServiceDetection.confidence * 100)}% confident you need help with ${enhancedServiceDetection.service}.`;
          
          finalResponse += confidenceNote;
        }
        
        // **NEW: Add alternative services suggestion for medium confidence**
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
        
        // **NEW: Enhanced bot message with comprehensive detection metadata**
        setChatMessages(prev => [...prev, { 
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
        }]);
        
        // **NEW: Enhanced contextual suggestions based on detection results**
        let contextualPrompts;
        if (enhancedServiceDetection.confidence > 0.6 && enhancedServiceDetection.service) {
          // High confidence: generate service-specific prompts
          contextualPrompts = generateContextualPrompts(
            enhancedServiceDetection.service, 
            updatedServiceContext.conversationDepth, 
            detectedLang,
            updatedServiceContext
          );
        } else if (enhancedServiceDetection.alternativeServices.length > 0) {
          // Medium confidence: include alternative service prompts
          const alternativePrompts = enhancedServiceDetection.alternativeServices
            .slice(0, 2)
            .flatMap(alt => generateContextualPrompts(
              alt.service, 
              0, 
              detectedLang,
              updatedServiceContext
            ));
          
          contextualPrompts = alternativePrompts.length > 0 ? 
            alternativePrompts : chatbotData.prompts[detectedLang];
        } else {
          // Low confidence: use default prompts
          contextualPrompts = chatbotData.prompts[detectedLang];
        }
        
        setSuggestions(contextualPrompts.length > 0 ? contextualPrompts : chatbotData.prompts[detectedLang]);
        
        // **NEW: Enhanced active service setting based on confidence**
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
          metadata: responseMetadata
        });
        
      } catch (error) {
        console.error('Error in enhanced response generation, falling back to basic processing:', error);
        
        // **NEW: Enhanced fallback processing with detection results**
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
        
        // **NEW: Enhanced fallback message with detection info**
        setChatMessages(prev => [...prev, { 
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
        }]);
        
        setSuggestions(responseData.suggestions || chatbotData.prompts[detectedLang]);
        setActiveService(enhancedServiceDetection.service || updatedServiceContext.currentService);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt) => {
    if (isClosing) return;
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
  const handleOpenChat = () => {
    setIsChatOpen(true);
    
    // Try to restore previous conversation
    setTimeout(() => {
      const restored = restorePreviousConversation();
      if (!restored) {
        // If no conversation was restored, show fresh welcome message
        setChatMessages([{ role: 'bot', content: chatbotData.welcome[language] }]);
        setSuggestions(chatbotData.prompts[language]);
      }
    }, 300);
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