// File: app/components/layout/ChatBot/ChatHeader.jsx
import { PenTool, Clock, X } from 'lucide-react';

export default function ChatHeader({ title, onClose }) {
  return (
    <div 
      className="px-4 py-3 flex justify-between items-center relative"
      style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(79, 70, 229, 0.95) 50%, rgba(147, 51, 234, 0.95) 100%)',
        borderBottom: '1px solid rgba(79, 70, 229, 0.4)'
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="bg-white bg-opacity-20 p-2 rounded-full flex items-center justify-center shadow-inner">
          <PenTool size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-medium text-white text-lg">{title}</h3>
          <div className="flex items-center text-xs text-blue-100 opacity-90">
            <Clock size={12} className="mr-1" /> 
            <span>Online Now</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
        aria-label="Close chat"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
      
      {/* Decorative header pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 30%)',
            backgroundSize: '150% 150%'
          }}
        ></div>
      </div>
    </div>
  );
}