// File: app/components/layout/chatBot/components/ChatContainer.jsx
'use client';

import { motion } from 'framer-motion';
import { chatContainerVariants } from '../animations';

/**
 * Main chat container with responsive design, spacious layout, and modern styling
 */
export default function ChatContainer({ 
  children, 
  isSmallScreen, 
  isClosing 
}) {
  return (
    <motion.div
      variants={chatContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        ${isSmallScreen ? 
          'fixed inset-0 w-full h-full max-h-full rounded-none' : 
          'w-96 md:w-[28rem] lg:w-[32rem] h-[36rem] max-h-[90vh] rounded-3xl'
        } 
        bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-gray-800/95 
        shadow-2xl overflow-hidden flex flex-col 
        border border-gray-700/50 backdrop-blur-xl
        z-50 ${isClosing ? 'pointer-events-none' : ''}
        transition-all duration-300 ease-out
      `}
      style={{
        backgroundColor: isSmallScreen ? 
          'rgba(15, 23, 42, 0.98)' : 
          'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px) saturate(180%)',
        boxShadow: isSmallScreen ? 
          'none' : 
          `
            0 32px 64px -16px rgba(0, 0, 0, 0.6),
            0 16px 32px -8px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        opacity: isClosing ? 0.7 : 1,
        transform: isClosing ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        // Modern glass morphism effect
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        // Subtle border gradient
        background: isSmallScreen ? 
          'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)' :
          `
            linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)
          `,
        // Enhanced border with gradient
        borderImage: isSmallScreen ? 
          'none' : 
          'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3)) 1'
      }}
    >
      {/* Subtle animated background pattern */}
      {!isSmallScreen && (
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.8) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)
            `,
            animation: 'subtle-float 20s ease-in-out infinite'
          }}
        />
      )}
      
      {/* Content with enhanced spacing */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
      
      {/* Subtle glow effect for desktop */}
      {!isSmallScreen && !isClosing && (
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-75 pointer-events-none"
          style={{
            animation: 'pulse-glow 4s ease-in-out infinite alternate'
          }}
        />
      )}
    </motion.div>
  );
}

// Add these CSS animations to your global styles or component styles
const styles = `
  @keyframes subtle-float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    33% { 
      transform: translateY(-2px) rotate(0.5deg); 
    }
    66% { 
      transform: translateY(2px) rotate(-0.5deg); 
    }
  }
  
  @keyframes pulse-glow {
    0% { 
      opacity: 0.4; 
      transform: scale(0.95); 
    }
    100% { 
      opacity: 0.8; 
      transform: scale(1.02); 
    }
  }
`;

// Export styles if needed
export { styles as ChatContainerStyles };