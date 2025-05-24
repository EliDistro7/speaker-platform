import React from 'react';
import { motion } from 'framer-motion';

export const NavButton = ({ 
  children, 
  isActive, 
  onClick, 
  mobile = false, 
  className = '',
  icon = null 
}) => {
  if (mobile) {
    return (
      <motion.button 
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          group relative w-full overflow-hidden rounded-xl px-4 py-3 text-left text-base font-medium 
          transition-all duration-300 backdrop-blur-sm
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
            : 'bg-gradient-to-r from-white/80 to-neutral-50/80 text-neutral-700 hover:from-indigo-50/90 hover:to-purple-50/90 hover:text-indigo-700 hover:shadow-md border border-neutral-200/60 hover:border-indigo-200/60'
          }
          ${className}
        `}
      >
        <div className="relative z-10 flex items-center space-x-2">
          {icon && (
            <motion.div
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className={isActive ? 'text-white' : 'text-neutral-600 group-hover:text-indigo-600'}
            >
              {icon}
            </motion.div>
          )}
          <span>{children}</span>
        </div>
        
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20"
          animate={{ 
            opacity: isActive ? 0 : 0,
            scale: isActive ? 1 : 0.8
          }}
          whileHover={{ 
            opacity: isActive ? 0 : 0.7,
            scale: 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Shimmer effect for active state */}
        {isActive && (
          <motion.div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        y: -1
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold 
        transition-all duration-300 backdrop-blur-sm
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:shadow-xl' 
          : 'bg-gradient-to-r from-white/90 to-neutral-50/90 text-neutral-700 hover:from-indigo-50/95 hover:to-purple-50/95 hover:text-indigo-700 hover:shadow-lg border border-neutral-200/60 hover:border-indigo-200/80'
        }
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center space-x-2">
        {icon && (
          <motion.div
            animate={{ 
              scale: isActive ? 1.1 : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              scale: { duration: 0.2 },
              rotate: { duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }
            }}
            className={isActive ? 'text-white' : 'text-neutral-600 group-hover:text-indigo-600'}
          >
            {icon}
          </motion.div>
        )}
        <span>{children}</span>
      </span>
      
      {/* Hover overlay for inactive state */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Shimmer effect for active state */}
      {isActive && (
        <motion.div
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
        />
      )}
      
      {/* Subtle glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl' 
            : 'bg-transparent'
        }`}
        animate={{ 
          scale: isActive ? [1, 1.05, 1] : 1,
          opacity: isActive ? [0.5, 0.8, 0.5] : 0
        }}
        transition={{ 
          duration: 2, 
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};