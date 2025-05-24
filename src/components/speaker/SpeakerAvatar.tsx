import React from 'react';
import { motion } from 'framer-motion';

export const SpeakerAvatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  showOnlineStatus = false,
  onClick = null,
  loading = false
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
    '2xl': 'w-64 h-64'
  };

  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      onClick={onClick}
      whileHover={onClick ? { 
        scale: 1.05,
        rotate: [0, -2, 2, 0]
      } : { scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        group relative ${sizes[size]} ${className}
        ${onClick ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/30 rounded-full' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      {/* Main avatar container */}
      <div className="relative h-full w-full">
        {/* Loading skeleton */}
        {loading ? (
          <div className="h-full w-full rounded-full bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
        ) : (
          <>
            {/* Avatar image */}
            <motion.img 
              src={src} 
              alt={alt} 
              className="h-full w-full rounded-full object-cover ring-2 ring-white shadow-lg transition-all duration-300 group-hover:shadow-xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=6366f1&color=fff&size=200&font-size=0.4`;
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            
            {/* Gradient overlay */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            
            {/* Animated ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400/60"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
        
        {/* Online status indicator */}
        {showOnlineStatus && !loading && (
          <motion.div
            className="absolute -bottom-1 -right-1 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
          >
            <motion.div 
              className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 0 rgba(16, 185, 129, 0.4)',
                  '0 0 0 4px rgba(16, 185, 129, 0.1)',
                  '0 0 0 0 rgba(16, 185, 129, 0)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-lg -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
    </Component>
  );
};