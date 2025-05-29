// File: app/components/layout/ChatBot/components/ServiceIndicator.jsx
'use client';

import { motion } from 'framer-motion';

/**
 * Component to display current service context and conversation depth
 */
export default function ServiceIndicator({ 
  serviceContext, 
  language,
  getServiceIndicatorText,
  getDeepConversationText,
  isDeepConversation 
}) {
  if (!serviceContext.currentService) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="text-blue-400 opacity-70">
        {getServiceIndicatorText(language)}
      </div>
      {isDeepConversation() && (
        <motion.div 
          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs deep-conversation-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getDeepConversationText(language)}
        </motion.div>
      )}
    </div>
  );
}