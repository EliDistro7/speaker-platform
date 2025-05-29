// File: app/components/layout/ChatBot/components/ConversationInsights.jsx
'use client';

import { motion } from 'framer-motion';

/**
 * Component to display conversation insights and service history
 */
export default function ConversationInsights({ 
  serviceContext,
  language,
  getServiceHistoryText,
  hasMultipleServices 
}) {
  if (!hasMultipleServices()) return null;

  const historyText = getServiceHistoryText(language);
  
  return (
    <motion.div 
      className="text-xs text-gray-400 opacity-60"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {historyText}
    </motion.div>
  );
}