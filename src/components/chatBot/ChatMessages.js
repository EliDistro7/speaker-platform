// File: app/components/layout/ChatBot/ChatMessages.jsx
import { Clock, Brain, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chatBubbleVariants, typingIndicatorVariants } from './animations';

export default function ChatMessages({ 
  messages, 
  isTyping, 
  chatEndRef, 
  chatScrollRef, 
  serviceContext, 
  insights 
}) {
  // Format message content with markdown support
  const formatMessageContent = (content) => {
    return (
      <ReactMarkdown
        components={{
          strong: ({ node, ...props }) => (
            <span className="font-semibold text-blue-300" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mb-3 text-white" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mb-2 text-white" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-bold mb-2 text-white" {...props} />
          ),
          p: ({ node, children, ...props }) => {
            // Handle paragraphs with better spacing and line break preservation
            return (
              <p className="mb-3 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 mb-3 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 leading-relaxed" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-gray-600" {...props} />
          ),
          // Handle code blocks
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code className="bg-gray-800 text-blue-300 px-1 py-0.5 rounded text-sm" {...props} />
            ) : (
              <code className="block bg-gray-800 text-blue-300 p-2 rounded mb-2 text-sm overflow-x-auto" {...props} />
            )
          ),
          // Handle blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-300 mb-3" {...props} />
          ),
          // Handle line breaks
          br: ({ node, ...props }) => (
            <br className="mb-1" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Render service context indicator for messages
  const renderServiceContextIndicator = (messageServiceContext, detectedService) => {
    const context = messageServiceContext || detectedService;
    if (!context) return null;

    // Handle both string and object contexts
    const contextName = typeof context === 'string' ? context : context.currentService || 'Unknown';

    return (
      <div className="flex items-center gap-1 text-xs text-blue-400 opacity-70 mt-1">
        <Target size={10} />
        <span>{contextName}</span>
      </div>
    );
  };

  // Render conversation insights indicator
  const renderInsightsIndicator = (messageInsights) => {
    if (!messageInsights || !messageInsights.insights || messageInsights.insights.length === 0) return null;

    // Ensure insights is an array and contains only strings
    const insightsArray = Array.isArray(messageInsights.insights) ? messageInsights.insights : [];
    const validInsights = insightsArray.filter(insight => typeof insight === 'string');

    if (validInsights.length === 0) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-purple-400 opacity-70 mt-1">
        <Brain size={10} />
        <span>{validInsights.join(', ')}</span>
      </div>
    );
  };

  // Render conversation depth indicator
  const renderDepthIndicator = (conversationDepth) => {
    if (!conversationDepth || conversationDepth <= 2) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-green-400 opacity-70 mt-1">
        <TrendingUp size={10} />
        <span>Depth: {conversationDepth}</span>
      </div>
    );
  };

  return (
    <div 
      className="flex-1 overflow-hidden flex flex-col relative"
      style={{
        background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
      }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Service context header - shows current active service */}
      {serviceContext && serviceContext.currentService && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-blue-500/20 p-2 z-10">
          <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
            <Target size={14} />
            <span>Current Focus: {serviceContext.currentService}</span>
            {serviceContext.conversationDepth > 3 && (
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs ml-2">
                Deep Discussion
              </span>
            )}
          </div>
        </div>
      )}

      {/* Conversation insights banner */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-purple-500/20 p-2 z-10">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
            <Brain size={14} />
            <span>{insights.insights.join(' • ')}</span>
          </div>
        </div>
      )}
    
      {/* Actual scrollable messages container */}
      <div 
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent p-4 z-10" 
        style={{ 
          overscrollBehavior: 'contain',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(75, 85, 99, 0.5) transparent'
        }}
      >
        {messages.map((msg, index) => (
          <motion.div 
            key={index}
            variants={chatBubbleVariants}
            initial="initial"
            animate="animate"
            className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-md relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none border border-blue-500' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-bl-none border border-gray-600'
              }`}
              style={
                msg.role === 'user'
                  ? { boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }
                  : { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }
              }
            >
              {/* Enhanced service context indicator for messages with detected service */}
              {(msg.serviceContext || msg.detectedService) && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full opacity-60">
                  <Target size={8} />
                </div>
              )}

              {formatMessageContent(msg.content)}
              
              {/* Message metadata section */}
              <div className="mt-2 space-y-1">
                {/* Service context indicator */}
                {renderServiceContextIndicator(msg.serviceContext, msg.detectedService)}
                
                {/* Conversation insights */}
                {renderInsightsIndicator(msg.insights)}
                
                {/* Conversation depth */}
                {renderDepthIndicator(msg.conversationDepth)}
                
                {/* Confidence and matched terms for user messages */}
                {msg.role === 'user' && msg.confidence && (
                  <div className="flex items-center gap-2 text-xs opacity-50">
                    {msg.confidence > 0.7 && (
                      <span className="text-green-400">High confidence</span>
                    )}
                    {msg.matchedTerms && Array.isArray(msg.matchedTerms) && msg.matchedTerms.length > 0 && (
                      <span className="text-yellow-400">
                        Matched: {msg.matchedTerms.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                {msg.timestamp && (
                  <div className="flex items-center text-xs opacity-60 mt-1">
                    <Clock size={10} className="mr-1" />
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              variants={typingIndicatorVariants}
              initial="initial"
              animate="animate"
              exit="initial"
              className="flex items-center mb-4"
            >
              <div className="px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl rounded-bl-none inline-flex items-center border border-gray-600 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '0ms', animationDuration: '1.2s' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '150ms', animationDuration: '1.2s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '300ms', animationDuration: '1.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}