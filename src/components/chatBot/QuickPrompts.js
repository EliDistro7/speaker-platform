// File: app/components/layout/ChatBot/QuickPrompts.jsx
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { quickPromptVariants } from './animations';

export default function QuickPrompts({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-2 max-h-24 overflow-y-auto custom-scrollbar pb-1">
      {suggestions.map((prompt, index) => (
        <motion.button
          key={index}
          custom={index}
          variants={quickPromptVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(prompt)}
          className="px-3 py-1.5 text-xs bg-gray-700 text-blue-100 rounded-full transition-all border border-gray-600 flex items-center gap-1 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: 'rgba(55, 65, 81, 0.8)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          <ChevronRight size={12} className="text-blue-400" />
          <span className="truncate max-w-[180px]">{prompt}</span>
        </motion.button>
      ))}
    </div>
  );
}