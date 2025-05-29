// File: app/components/layout/ChatBot/components/ChatHeader.jsx
'use client';

import { Sparkles, X, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { chatbotData } from '@/data/chat/index';

/**
 * Enhanced chat header with service context display
 */
export default function ChatHeader({ 
  language,
  serviceContext,
  isSmallScreen,
  isClosing,
  onClose
}) {
  return (
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
            onClick={() => onClose(true)}
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
          onClick={() => onClose(true)}
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
  );
}