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

  // Optional: Restore previous conversation
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

  // MAIN ENHANCEMENT: Enhanced message processing with advanced response generation
  const handleMessageSend = () => {
    if (!message.trim() || isClosing) return;
    
    const userMessage = message.trim();
    
    // Use detectLanguage utility to detect language from user message
    const detectedLang = detectLanguage(userMessage, null, language);
    
    // Use enhanced service detection from utilities
    const serviceDetection = detectServiceFromMessage(userMessage, detectedLang);
    
    // Analyze message intent using the new response generator utility
    const intentAnalysis = analyzeMessageIntent(userMessage, detectedLang);
    
    // Update service context using utility function
    const updatedServiceContext = updateServiceContext(
      serviceContext, 
      serviceDetection.service, 
      userMessage
    );
    setServiceContext(updatedServiceContext);
    
    // Add user message with enhanced metadata
    setChatMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang,
      detectedService: serviceDetection.service,
      serviceContext: updatedServiceContext.currentService,
      confidence: serviceDetection.confidence,
      matchedTerms: serviceDetection.matchedTerms,
      intentAnalysis: intentAnalysis
    }]);
    
    setMessage('');
    setIsTyping(true);
    
    // Optional: Auto-switch language if user consistently uses a different language
    const userMessagesInDetectedLang = chatMessages.filter(
      msg => msg.role === 'user' && msg.language === detectedLang
    ).length;
    
    if (detectedLang !== language && userMessagesInDetectedLang >= 2) {
      console.log(`User consistently using ${detectedLang}, consider switching language`);
      // Uncomment the line below if you want to auto-switch language
      // setLanguage(detectedLang);
    }
    
    // Scroll to bottom immediately after sending message
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
    
    // NEW: Process message using the advanced response generator
    setTimeout(() => {
      try {
        // Generate contextual response using the new response generator
        const generatedResponse = generateContextualResponse(
          userMessage,
          serviceDetection,
          intentAnalysis,
          chatbotData,
          detectedLang,
          updatedServiceContext,
          pricingData
        );
        
        // Validate the generated response
        if (!validateResponse(generatedResponse)) {
          console.warn('Generated response validation failed, falling back to basic processing');
          throw new Error('Invalid response structure');
        }
        
        // Use the generated response
        let finalResponse = generatedResponse.text;
        let responseMetadata = generatedResponse.metadata || {};
        
        // Add the bot message with enhanced metadata
        setChatMessages(prev => [...prev, { 
          role: 'bot', 
          content: finalResponse,
          timestamp: new Date().toISOString(),
          language: detectedLang,
          serviceContext: updatedServiceContext.currentService,
          conversationDepth: updatedServiceContext.conversationDepth,
          responseType: generatedResponse.type,
          responseMetadata: responseMetadata,
          insights: getConversationInsights(updatedServiceContext)
        }]);
        
        // Generate enhanced contextual suggestions
        const contextualPrompts = generateContextualPrompts(
          updatedServiceContext.currentService, 
          updatedServiceContext.conversationDepth, 
          detectedLang,
          updatedServiceContext
        );
        
        setSuggestions(contextualPrompts.length > 0 ? contextualPrompts : chatbotData.prompts[detectedLang]);
        
        // Update active service based on response
        if (generatedResponse.service) {
          setActiveService(generatedResponse.service);
        } else if (updatedServiceContext.currentService) {
          setActiveService(updatedServiceContext.currentService);
        }
        
        console.log('Response generated successfully:', {
          type: generatedResponse.type,
          service: generatedResponse.service,
          metadata: responseMetadata
        });
        
      } catch (error) {
        console.error('Error in response generation, falling back to basic processing:', error);
        
        // Fallback to the original processing method
        let responseData = processUserMessage(userMessage, chatbotData, detectedLang);
        let finalResponse = responseData.text;
        
        // Enhanced response with service context and pricing information (fallback)
        if (serviceDetection.service && isPricingInquiry(userMessage, detectedLang)) {
          const pricingResponse = generatePricingResponse(serviceDetection.service, detectedLang, pricingData);
          finalResponse = pricingResponse;
        } else if (serviceDetection.service && !isPricingInquiry(userMessage, detectedLang)) {
          const serviceResponse = getServiceResponse(serviceDetection.service, chatbotData, detectedLang);
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
        
        setChatMessages(prev => [...prev, { 
          role: 'bot', 
          content: finalResponse,
          timestamp: new Date().toISOString(),
          language: detectedLang,
          serviceContext: updatedServiceContext.currentService,
          conversationDepth: updatedServiceContext.conversationDepth,
          insights: insights,
          fallbackUsed: true
        }]);
        
        setSuggestions(responseData.suggestions || chatbotData.prompts[detectedLang]);
        setActiveService(updatedServiceContext.currentService);
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

  // Enhanced service lookup with advanced context management
  const handleServiceLookup = (serviceName) => {
    const matchedService = findMatchingService(serviceName, chatbotData.serviceKeywords, language);
    if (matchedService) {
      const serviceResponse = getServiceResponse(matchedService, chatbotData, language);
      
      // Update service context using utility function
      const updatedContext = updateServiceContext(serviceContext, matchedService, `Service lookup: ${serviceName}`);
      setServiceContext(updatedContext);
      
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: serviceResponse,
        timestamp: new Date().toISOString(),
        serviceContext: matchedService,
        trigger: 'service_lookup'
      }]);
      
      setActiveService(matchedService);
      
      // Generate contextual suggestions for the new service
      const contextualPrompts = generateContextualPrompts(matchedService, 0, language, updatedContext);
      setSuggestions(contextualPrompts);
    }
  };

  // FAQ lookup with context awareness
  const handleFaqLookup = (question) => {
    const faqAnswer = findFaqMatch(question, chatbotData.faqs, language);
    if (faqAnswer) {
      // Update context to track FAQ interaction
      const updatedContext = updateServiceContext(serviceContext, null, `FAQ: ${question}`);
      setServiceContext(updatedContext);
      
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: faqAnswer,
        timestamp: new Date().toISOString(),
        trigger: 'faq_lookup'
      }]);
    }
  };

  // Enhanced contact information handler
  const handleContactRequest = () => {
    const contactResponse = getContactResponse(chatbotData.contactInfo, language);
    
    // Add personalized message based on service context
    let personalizedContact = contactResponse;
    if (serviceContext.currentService) {
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
      serviceContext: serviceContext.currentService
    }]);
  };

  // Service context validation on component update
  useEffect(() => {
    if (!validateServiceContext(serviceContext)) {
      console.warn('Invalid service context detected, resetting...');
      setServiceContext(createFreshServiceContext());
    }
  }, [serviceContext]);

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

  // Debug service context (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Context Updated:', serviceContext);
    }
  }, [serviceContext]);
  
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
            {/* Enhanced Chat Header with better close button */}
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
                    <p className="text-blue-300 text-xs opacity-80">
                      {language === 'sw' ? 'Tunazungumza kuhusu' : 'Discussing'}: {serviceContext.currentService}
                    </p>
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
                  </motion.button>
                )}
                
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
              />
              
              <ChatInput 
                message={message}
                setMessage={setMessage}
                onSend={handleMessageSend}
                inputRef={inputRef}
                placeholder={chatbotData.ui.inputPlaceholder[language]}
                disabled={isClosing}
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
      
      {/* Custom styles for animations and scrollbars */}
      <style jsx global>{`
        @keyframes wave {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .animate-wave {
          animation: wave 3s linear infinite;
        }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
          border-radius: 20px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.7);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.7);
        }

        /* Enhanced service context indicators */
        .service-indicator {
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .deep-conversation-badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Closing animation styles */
        .closing-chat {
          transition: all 0.3s ease-out;
          transform: scale(0.95);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}