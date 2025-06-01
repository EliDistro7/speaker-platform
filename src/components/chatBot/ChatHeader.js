// ===== 4. ENHANCED CHAT HEADER COMPONENT (components/ChatHeader.jsx) =====
import { Sparkles, X, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { chatbotData } from '@/data/chat/index';

export default function ChatHeader({
  language,
  serviceContext,
  currentDetectionResult,
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
            <div className="flex items-center gap-2">
              <p className="text-blue-300 text-xs opacity-80">
                {language === 'sw' ? 'Tunazungumza kuhusu' : 'Discussing'}: {serviceContext.currentService}
              </p>
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
        {isSmallScreen && (
          <motion.button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isClosing}
          >
            <Minimize2 className="w-4 h-4" />
          </motion.button>
        )}
        
        <motion.button
          onClick={onClose}
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
