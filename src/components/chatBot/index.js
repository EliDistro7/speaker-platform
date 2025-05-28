// File: app/components/layout/ChatBot/index.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { chatbotData } from '@/data/chat/index';

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

// Component imports
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import FloatingButton from './FloatingButton';

// Animation variants import
import { chatContainerVariants } from './animations';

export default function ChatBot() {
  const pricingData = chatbotData.pricing;
  const { language, setLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);
  
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

  // Manage outside clicks to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  // Enhanced message processing with advanced service context management
  const handleMessageSend = () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    
    // Use detectLanguage utility to detect language from user message
    const detectedLang = detectLanguage(userMessage, null, language);
    
    // Use enhanced service detection from utilities
    const serviceDetection = detectServiceFromMessage(userMessage, detectedLang);
    const detectedService = serviceDetection.service;
    
    // Update service context using utility function
    const updatedServiceContext = updateServiceContext(
      serviceContext, 
      detectedService, 
      userMessage
    );
    setServiceContext(updatedServiceContext);
    
    // Add user message with enhanced metadata
    setChatMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang,
      detectedService: detectedService,
      serviceContext: updatedServiceContext.currentService,
      confidence: serviceDetection.confidence,
      matchedTerms: serviceDetection.matchedTerms
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
    
    // Process message and generate response
    setTimeout(() => {
      let responseData = processUserMessage(userMessage, chatbotData, detectedLang);
      let finalResponse = responseData.text;
      
      // Enhanced response with service context and pricing information
      if (detectedService && isPricingInquiry(userMessage, detectedLang)) {
        // Generate enhanced pricing response using utility
        const pricingResponse = generatePricingResponse(detectedService, detectedLang, pricingData);
        finalResponse = pricingResponse;
      } else if (detectedService && !isPricingInquiry(userMessage, detectedLang)) {
        // Provide service information with context
        const serviceResponse = getServiceResponse(detectedService, chatbotData, detectedLang);
        if (serviceResponse && serviceResponse !== responseData.text) {
          finalResponse = serviceResponse;
        }
      }
      
      // Add conversation insights for high engagement
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
        insights: insights
      }]);
      
      // Generate enhanced contextual suggestions using utility
      const contextualPrompts = generateContextualPrompts(
        updatedServiceContext.currentService, 
        updatedServiceContext.conversationDepth, 
        detectedLang,
        updatedServiceContext
      );
      
      setSuggestions(contextualPrompts.length > 0 ? contextualPrompts : responseData.suggestions || []);
      
      // Update active service
      setActiveService(updatedServiceContext.currentService);
      
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt) => {
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

  // Debug service context (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Context Updated:', serviceContext);
    }
  }, [serviceContext]);
  
  return (
    <div className="fixed bottom-6 right-6 z-40 sm:z-40" ref={containerRef}>
      {!isChatOpen && (
        <FloatingButton onClick={() => setIsChatOpen(true)} />
      )}
      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              ${isSmallScreen ? 'fixed inset-0 w-full h-full max-h-full rounded-none' : 
              'w-80 md:w-96 h-[32rem] rounded-2xl max-h-[85vh]'} 
              bg-gray-900 shadow-2xl overflow-hidden flex flex-col border border-gray-700 backdrop-blur-lg
              z-50
            `}
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(12px)',
              boxShadow: isSmallScreen ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <ChatHeader 
              title={chatbotData.ui.title[language]} 
              onClose={() => setIsChatOpen(false)}
              isFullScreen={isSmallScreen}
              // Enhanced service context indicator
              serviceContext={serviceContext.currentService}
              conversationDepth={serviceContext.conversationDepth}
            />
            
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
              />
              
              <ChatInput 
                message={message}
                setMessage={setMessage}
                onSend={handleMessageSend}
                inputRef={inputRef}
                placeholder={chatbotData.ui.inputPlaceholder[language]}
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
            </div>
          </motion.div>
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
      `}</style>
    </div>
  );
}