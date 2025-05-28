// File: app/components/layout/ChatBot/index.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { chatbotData } from '@/data/chat/index';

// Import all utility functions from chatBotUtils
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
  const { language, setLanguage } = useLanguage(); // Add setLanguage if you want to auto-switch
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeService, setActiveService] = useState(null);
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

  const handleMessageSend = () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    
    // Use detectLanguage utility to detect language from user message
    const detectedLang = detectLanguage(userMessage, null, language);
    
    // Add user message with detected language
    setChatMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang // Store detected language with the message
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
    
    // Process message and generate response using utility function
    setTimeout(() => {
      const responseData = processUserMessage(userMessage, chatbotData, detectedLang);
      
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: responseData.text,
        timestamp: new Date().toISOString(),
        language: detectedLang // Bot responds in same language
      }]);
      
      // Update suggestions using generateSuggestions utility
      setSuggestions(responseData.suggestions || []);
      
      // Try to identify service from response
      if (responseData.text.startsWith('**')) {
        const serviceTitle = responseData.text.split('\n')[0].replace(/\*\*/g, '');
        if (chatbotData.serviceDescriptions[detectedLang]?.[serviceTitle]) {
          setActiveService(serviceTitle);
        }
      } else {
        setActiveService(null);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
    // Auto-submit the prompt after a brief delay
    setTimeout(() => handleMessageSend(), 300);
  };

  // Additional utility function for manual service lookup
  const handleServiceLookup = (serviceName) => {
    const matchedService = findMatchingService(serviceName, chatbotData.serviceKeywords, language);
    if (matchedService) {
      const serviceResponse = getServiceResponse(matchedService, chatbotData, language);
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: serviceResponse,
        timestamp: new Date().toISOString()
      }]);
      setActiveService(matchedService);
      setSuggestions(generateSuggestions(matchedService, chatbotData, language));
    }
  };

  // Additional utility function for FAQ lookup
  const handleFaqLookup = (question) => {
    const faqAnswer = findFaqMatch(question, chatbotData.faqs, language);
    if (faqAnswer) {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: faqAnswer,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Contact information handler
  const handleContactRequest = () => {
    const contactResponse = getContactResponse(chatbotData.contactInfo, language);
    setChatMessages(prev => [...prev, { 
      role: 'bot', 
      content: contactResponse,
      timestamp: new Date().toISOString()
    }]);
  };

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
            />
            
            <ChatMessages 
              messages={chatMessages}
              isTyping={isTyping}
              chatEndRef={chatEndRef}
              chatScrollRef={chatScrollRef}
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
              />
              
              <ChatInput 
                message={message}
                setMessage={setMessage}
                onSend={handleMessageSend}
                inputRef={inputRef}
                placeholder={chatbotData.ui.inputPlaceholder[language]}
              />
              
              {/* Contact info button using utility function */}
              <div className="flex justify-center pt-1">
                <motion.button
                  onClick={handleContactRequest}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
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
      `}</style>
    </div>
  );
}