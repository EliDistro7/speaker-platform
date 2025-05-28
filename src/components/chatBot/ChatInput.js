// File: app/components/layout/ChatBot/ChatInput.jsx
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({ message, setMessage, onSend, inputRef, placeholder }) {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="flex gap-2 relative"
    >
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 pr-12 shadow-inner"
        style={{
          background: 'rgba(55, 65, 81, 0.7)',
          backdropFilter: 'blur(5px)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
        placeholder={placeholder}
      />
      <motion.button
        type="submit"
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white transition-all ${
          message.trim() 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md' 
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
        disabled={!message.trim()}
        whileHover={message.trim() ? { scale: 1.1 } : {}}
        whileTap={message.trim() ? { scale: 0.9 } : {}}
        style={message.trim() ? { boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)' } : {}}
      >
        <Send size={16} className="transform rotate-0" strokeWidth={2.5} />
      </motion.button>
    </form>
  );
}

