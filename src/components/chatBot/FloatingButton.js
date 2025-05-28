// File: app/components/layout/ChatBot/FloatingButton.jsx
import { Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { floatingButtonVariants } from './animations';

export default function FloatingButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg text-white overflow-hidden"
      variants={floatingButtonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      aria-label="Open chat assistant"
    >
      <div className="relative flex items-center justify-center">
        <Sparkles 
          size={24} 
          className="absolute opacity-70 animate-pulse" 
          style={{ animationDuration: '3s' }}
        />
        <MessageCircle 
          size={26} 
          className="relative z-10" 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Pulse animation */}
      <span className="absolute w-full h-full rounded-full animate-ping bg-blue-400 opacity-20"></span>
      
      {/* Decorative wave effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-1 bg-white opacity-10 animate-wave"></div>
      </div>
    </motion.button>
  );
}
