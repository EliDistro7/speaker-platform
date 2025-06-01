// ===== 1. MAIN CHATBOT COMPONENT (index.jsx) =====
'use client';



import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/language';
import { chatbotData } from '@/data/chat/index';

// Hooks
import { useChatState } from './hooks/useChatState';
import { useChatEffects } from './hooks/useChatEffects';
import { useChatActions } from './hooks/useChatActions';
import { useMessageSender } from './hooks/sender/useMessageSender';
import { useConversationRestore } from './hooks/useConversationRestore';

// Components
import ChatContainer from './components/ChatContainer';
import FloatingButton from '@/components/chatBot/FloatingButton';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import ServiceIndicator from './components/ServiceIndicator';

export default function ChatBot() {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatScrollRef = useRef(null);

  

  // Custom hooks for state management
  const {
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
    handleCloseChat
  } = useChatState(language);

  // Message sending logic
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
    chatbotData.pricing
  );


      // Restore previous conversation state
    const { restorePreviousConversation } = useConversationRestore({
        language,
        setChatMessages,
        setServiceContext,
        setActiveService,
        setSuggestions,
        setConversationStats,
        setConversationPatterns
    })

  // Chat actions and handlers
  const chatActions = useChatActions({
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
    restorePreviousConversation,
    setDetectionHistory,
    setCurrentDetectionResult,
    setSuggestionAnalytics,
    handleMessageSend,
    setMessage,
    handleCloseChat
  });

  // Side effects (initialization, auto-scroll, etc.)
  useChatEffects({
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
  });




  return (
    <div className="fixed bottom-6 right-6 z-50 " ref={containerRef}>
      {!isChatOpen && (
        <FloatingButton onClick={chatActions.handleOpenChat} />
      )}
      
      {isChatOpen && (
        <ChatContainer 
          isSmallScreen={isSmallScreen}
          isClosing={isClosing}
        >
          <ChatHeader
            language={language}
            serviceContext={serviceContext}
            currentDetectionResult={currentDetectionResult}
            isSmallScreen={isSmallScreen}
            isClosing={isClosing}
            onClose={() => handleCloseChat(true)}
          />
          
          <ChatMessages 
            messages={chatMessages}
            isTyping={isTyping}
            chatEndRef={chatEndRef}
            chatScrollRef={chatScrollRef}
            serviceContext={serviceContext}
            insights={chatActions.getInsights()}
            currentDetection={currentDetectionResult}
            detectionHistory={detectionHistory}
          />
          
          <div className="border-t border-gray-700 p-4 space-y-3 bg-gradient-to-t from-gray-800/98 to-gray-900/95">
            <QuickPrompts 
              suggestions={suggestions} 
              onSelect={chatActions.handleQuickPrompt}
              serviceContext={serviceContext}
              conversationDepth={serviceContext.conversationDepth}
              disabled={isClosing}
              detectionConfidence={currentDetectionResult?.confidence || 0}
              onRegenerateSuggestions={chatActions.handleRegenerateSuggestions}
              onIndustrySuggestions={chatActions.handleIndustrySuggestions}
            />
            
            <ChatInput 
              message={message}
              setMessage={setMessage}
              onSend={handleMessageSend}
              inputRef={inputRef}
              placeholder={chatbotData.ui.inputPlaceholder[language]}
              disabled={isClosing}
              detectionHint={currentDetectionResult?.service ? 
                (language === 'sw' ? 
                  `Kuhusu ${currentDetectionResult.service} (${Math.round(currentDetectionResult.confidence * 100)}% uhakika)` :
                  `About ${currentDetectionResult.service} (${Math.round(currentDetectionResult.confidence * 100)}% confidence)`
                ) : null}
            />
            
            <ServiceIndicator
              language={language}
              serviceContext={serviceContext}
              currentDetectionResult={currentDetectionResult}
              isSmallScreen={isSmallScreen}
              isClosing={isClosing}
              onContactRequest={chatActions.handleContactRequest}
            />
          </div>
        </ChatContainer>
      )}
    </div>
  );
}