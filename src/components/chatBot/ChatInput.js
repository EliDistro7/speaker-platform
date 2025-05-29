import { Send, Sparkles, Target, Brain, MessageCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ChatInput({ 
  message, 
  setMessage, 
  onSend, 
  inputRef, 
  placeholder, 
  disabled = false,
  detectionHint,
  // NEW: Enhanced props for better context awareness
  serviceContext,
  currentDetection,
  conversationDepth = 0,
  isTyping = false,
  // NEW: Language support
  language = 'en'
}) {
  const [isComposing, setIsComposing] = useState(false);
  const [showEnhancedHints, setShowEnhancedHints] = useState(false);

  // Enhanced detection confidence and context
  const detectionConfidence = currentDetection?.confidence || 0;
  const detectedService = currentDetection?.service;
  const hasAlternatives = currentDetection?.alternativeServices?.length > 0;
  const detectionMethod = currentDetection?.detectionMethod;

  // Auto-show enhanced hints for high confidence or deep conversations
  useEffect(() => {
    const shouldShowHints = (
      detectionConfidence > 0.7 || 
      conversationDepth > 3 || 
      (serviceContext?.currentService && conversationDepth > 1)
    );
    setShowEnhancedHints(shouldShowHints);
  }, [detectionConfidence, conversationDepth, serviceContext]);

  // Enhanced placeholder text based on context
  const getContextualPlaceholder = () => {
    if (disabled) {
      return language === 'sw' ? 'Subiri kidogo...' : 'Please wait...';
    }

    if (isTyping) {
      return language === 'sw' ? 'Bot inajibu...' : 'Bot is responding...';
    }

    // High confidence service detection
    if (detectionConfidence > 0.8 && detectedService) {
      return language === 'sw' 
        ? `Uliza zaidi kuhusu ${detectedService}...`
        : `Ask more about ${detectedService}...`;
    }

    // Medium confidence with alternatives
    if (detectionConfidence > 0.5 && hasAlternatives) {
      return language === 'sw'
        ? 'Bainisha huduma unayohitaji...'
        : 'Specify which service you need...';
    }

    // Deep conversation
    if (conversationDepth > 4 && serviceContext?.currentService) {
      return language === 'sw'
        ? 'Una maswali mengine?'
        : 'Any other questions?';
    }

    // Service context exists
    if (serviceContext?.currentService) {
      return language === 'sw'
        ? `Maswali kuhusu ${serviceContext.currentService}?`
        : `Questions about ${serviceContext.currentService}?`;
    }

    return placeholder;
  };

  // Enhanced detection hint with more context
  const getEnhancedDetectionHint = () => {
    if (!showEnhancedHints) return detectionHint;

    const hints = [];

    // High confidence hint
    if (detectionConfidence > 0.8 && detectedService) {
      const confidenceText = language === 'sw' 
        ? `🎯 ${Math.round(detectionConfidence * 100)}% uhakika - ${detectedService}`
        : `🎯 ${Math.round(detectionConfidence * 100)}% confident - ${detectedService}`;
      hints.push(confidenceText);
    }

    // Medium confidence with alternatives
    if (detectionConfidence > 0.4 && detectionConfidence < 0.8 && hasAlternatives) {
      const alternativesText = language === 'sw'
        ? `🤔 ${currentDetection.alternativeServices.length} huduma zingine zinawezekana`
        : `🤔 ${currentDetection.alternativeServices.length} alternative services possible`;
      hints.push(alternativesText);
    }

    // Deep conversation hint
    if (conversationDepth > 5) {
      const deepText = language === 'sw'
        ? '💬 Mazungumzo ya kina - wasiliana na mtaalamu?'
        : '💬 Deep conversation - contact specialist?';
      hints.push(deepText);
    }

    // Service history hint
    if (serviceContext?.serviceHistory?.length > 2) {
      const historyText = language === 'sw'
        ? `📋 Huduma ${serviceContext.serviceHistory.length} zimejadiliwa`
        : `📋 ${serviceContext.serviceHistory.length} services discussed`;
      hints.push(historyText);
    }

    return hints.length > 0 ? hints[0] : detectionHint;
  };

  // Get appropriate icon based on context
  const getContextIcon = () => {
    if (detectionConfidence > 0.8) return Target;
    if (detectionConfidence > 0.5) return Brain;
    if (conversationDepth > 3) return MessageCircle;
    return Sparkles;
  };

  // Enhanced button styling based on context
  const getButtonStyling = () => {
    if (!message.trim() || disabled) {
      return 'bg-gray-600 cursor-not-allowed opacity-50';
    }

    // High confidence styling
    if (detectionConfidence > 0.8) {
      return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-md shadow-green-500/20';
    }

    // Medium confidence styling
    if (detectionConfidence > 0.5) {
      return 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20';
    }

    // Deep conversation styling
    if (conversationDepth > 4) {
      return 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20';
    }

    // Default styling
    return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md';
  };

  // Handle composition events for better IME support
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  // Enhanced form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled || isComposing) return;
    onSend();
  };

  // Keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !disabled && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const enhancedHint = getEnhancedDetectionHint();
  const ContextIcon = getContextIcon();

  return (
    <div className="space-y-2">
      {/* Enhanced hints section */}
      <AnimatePresence>
        {enhancedHint && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-1"
          >
            <ContextIcon size={12} className={`${
              detectionConfidence > 0.8 ? 'text-green-400' :
              detectionConfidence > 0.5 ? 'text-blue-400' :
              conversationDepth > 3 ? 'text-purple-400' :
              'text-blue-400'
            } flex-shrink-0`} />
            <span className="text-xs text-gray-300 truncate">
              {enhancedHint}
            </span>
            
            {/* Additional context indicators */}
            <div className="flex items-center gap-1 ml-auto">
              {detectionMethod && process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-gray-500 opacity-60">
                  {detectionMethod}
                </span>
              )}
              
              {conversationDepth > 0 && (
                <div className={`w-2 h-2 rounded-full ${
                  conversationDepth > 5 ? 'bg-purple-400' :
                  conversationDepth > 3 ? 'bg-blue-400' :
                  'bg-gray-400'
                } opacity-60`} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced input form */}
      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={`w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 text-white pr-12 shadow-inner transition-all duration-200 ${
              detectionConfidence > 0.8 
                ? 'bg-gray-700 border-green-500/50 focus:ring-green-500 focus:border-green-500' :
              detectionConfidence > 0.5 
                ? 'bg-gray-700 border-blue-500/50 focus:ring-blue-500 focus:border-blue-500' :
              conversationDepth > 3
                ? 'bg-gray-700 border-purple-500/50 focus:ring-purple-500 focus:border-purple-500' :
                'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={getContextualPlaceholder()}
            disabled={disabled}
            autoComplete="off"
            spellCheck="true"
          />

          {/* Character count for long messages */}
          {message.length > 100 && (
            <div className={`absolute -top-5 right-0 text-xs ${
              message.length > 300 ? 'text-red-400' :
              message.length > 200 ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {message.length}/500
            </div>
          )}

          {/* Enhanced send button */}
          <motion.button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white transition-all duration-200 ${getButtonStyling()}`}
            disabled={!message.trim() || disabled || isComposing}
            whileHover={message.trim() && !disabled ? { scale: 1.1 } : {}}
            whileTap={message.trim() && !disabled ? { scale: 0.9 } : {}}
            title={
              !message.trim() ? (language === 'sw' ? 'Andika ujumbe' : 'Type a message') :
              disabled ? (language === 'sw' ? 'Subiri...' : 'Please wait...') :
              isComposing ? (language === 'sw' ? 'Inamalizia...' : 'Composing...') :
              language === 'sw' ? 'Tuma ujumbe (Ctrl+Enter)' : 'Send message (Ctrl+Enter)'
            }
          >
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  key="typing"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Send size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>

      {/* Enhanced keyboard shortcuts hint */}
      {!disabled && message.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 opacity-60 text-center"
        >
          {language === 'sw' ? 'Ctrl+Enter kutuma' : 'Ctrl+Enter to send'}
        </motion.div>
      )}

      {/* Service context quick actions */}
      {serviceContext?.currentService && conversationDepth > 2 && !disabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center justify-center gap-2 pt-1"
        >
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>
              {language === 'sw' ? 'Mazungumzo kuhusu' : 'Discussing'}: {serviceContext.currentService}
            </span>
            {conversationDepth > 4 && (
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                {language === 'sw' ? 'Kina' : 'Deep'}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}