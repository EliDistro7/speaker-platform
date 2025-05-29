import { Clock, Brain, Target, TrendingUp, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chatBubbleVariants, typingIndicatorVariants } from './animations';

export default function ChatMessages({ 
  messages, 
  isTyping, 
  chatEndRef, 
  chatScrollRef, 
  serviceContext, 
  insights,
  currentDetection,
  detectionHistory
}) {
  // Format message content with markdown support
  const formatMessageContent = (content) => {
    return (
      <ReactMarkdown
        components={{
          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
          em: ({children}) => <em className="italic">{children}</em>,
          ul: ({children}) => <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>,
          li: ({children}) => <li className="mb-1">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Render detection confidence indicator (more compact)
  const renderConfidenceIndicator = (confidence) => {
    if (!confidence || confidence < 0.3) return null;
    
    const confidencePercent = Math.round(confidence * 100);
    let colorClass = 'text-red-400';
    if (confidence > 0.7) colorClass = 'text-green-400';
    else if (confidence > 0.4) colorClass = 'text-yellow-400';

    return (
      <div className={`inline-flex items-center gap-1 text-xs ${colorClass} opacity-80`}>
        <BarChart2 size={10} />
        <span>{confidencePercent}%</span>
      </div>
    );
  };

  // Render matched terms (more compact)
  const renderMatchedTerms = (terms) => {
    if (!terms || !Array.isArray(terms) || terms.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {terms.slice(0, 2).map((term, i) => (
          <span key={i} className="bg-gray-600/50 px-1.5 py-0.5 rounded text-xs opacity-70">
            {typeof term === 'object' ? term.term : term}
          </span>
        ))}
        {terms.length > 2 && (
          <span className="text-xs opacity-50">+{terms.length - 2} more</span>
        )}
      </div>
    );
  };

  // Render alternative services (more compact)
  const renderAlternativeServices = (alternatives) => {
    if (!alternatives || alternatives.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {alternatives.slice(0, 2).map((alt, i) => (
          <span key={i} className="bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded text-xs">
            {alt.service} ({Math.round(alt.confidence * 100)}%)
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />

      {/* Compact service context header */}
      {serviceContext && serviceContext.currentService && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-blue-500/20 p-2 z-10">
          <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
            <Target size={12} />
            <span>Focus: {serviceContext.currentService}</span>
            {currentDetection?.confidence && renderConfidenceIndicator(currentDetection.confidence)}
          </div>
        </div>
      )}

      {/* Compact conversation insights banner */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/20 p-1.5 z-10">
          <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
            <Brain size={10} />
            <span>{insights.insights[0]}</span>
          </div>
        </div>
      )}
    
      {/* Scrollable messages container with better spacing */}
      <div 
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 z-10"
        style={{
          // Ensure messages are properly spaced and don't get cut off
          paddingBottom: '60px' // Extra space at bottom to prevent last message from being obscured
        }}
      >
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <motion.div 
              key={`${index}-${msg.timestamp || Date.now()}`}
              variants={chatBubbleVariants}
              initial="initial"
              animate="animate"
              className={`mb-3 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div className={`px-3 py-2.5 rounded-2xl max-w-[85%] shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-bl-none'
              }`}>
                {/* Message content */}
                <div className="text-sm leading-relaxed">
                  {formatMessageContent(msg.content)}
                </div>
                
                {/* Compact metadata section */}
                <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                  <div className="flex items-center gap-2">
                    {/* Service context */}
                    {msg.serviceContext && (
                      <div className="flex items-center gap-1">
                        <Target size={8} />
                        <span className="truncate max-w-[80px]">{msg.serviceContext}</span>
                      </div>
                    )}
                    
                    {/* Detection confidence */}
                    {msg.enhancedDetection?.confidence > 0.3 && (
                      renderConfidenceIndicator(msg.enhancedDetection.confidence)
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  {msg.timestamp && (
                    <div className="flex items-center gap-1">
                      <Clock size={8} />
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
                
                {/* Expandable detection details (only show for development or when explicitly needed) */}
                {process.env.NODE_ENV === 'development' && msg.enhancedDetection && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                      Detection Details
                    </summary>
                    <div className="mt-1 space-y-1">
                      {renderMatchedTerms(msg.enhancedDetection.matchedTerms)}
                      {renderAlternativeServices(msg.enhancedDetection.alternativeServices)}
                      {msg.enhancedDetection.detectionMethod && (
                        <div className="text-xs text-gray-500">
                          Method: {msg.enhancedDetection.detectionMethod}
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Brain size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start a conversation...</p>
            </div>
          </div>
        )}
        
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              variants={typingIndicatorVariants}
              initial="initial"
              animate="animate"
              exit="initial"
              className="flex items-center mb-3"
            >
              <div className="px-3 py-2.5 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl rounded-bl-none inline-flex items-center border border-gray-600 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '0ms', animationDuration: '1.2s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '150ms', animationDuration: '1.2s' }} />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '300ms', animationDuration: '1.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll target - positioned at the very bottom */}
        <div ref={chatEndRef} className="h-4" />
      </div>
    </div>
  );
}