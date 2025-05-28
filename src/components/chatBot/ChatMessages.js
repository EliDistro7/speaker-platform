// File: app/components/layout/ChatBot/ChatMessages.jsx
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chatBubbleVariants, typingIndicatorVariants } from './animations';

export default function ChatMessages({ messages, isTyping, chatEndRef, chatScrollRef }) {
  // Format message content with markdown support
  const formatMessageContent = (content) => {
    return (
      <ReactMarkdown
        components={{
          strong: ({ node, ...props }) => (
            <span className="font-semibold text-blue-300" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mb-2 text-white" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mb-2 text-white" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-bold mb-1 text-white" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 mb-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
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
              className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-md ${
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
              {formatMessageContent(msg.content)}
              
              {msg.timestamp && (
                <div className="flex items-center text-xs opacity-60 mt-1">
                  <Clock size={10} className="mr-1" />
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
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