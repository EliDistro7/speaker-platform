import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  variant = 'default',
  hover = true,
  gradient = false,
  glow = false,
  animate = true,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-neutral-200/60',
    glass: 'bg-white/80 backdrop-blur-lg border border-white/20',
    gradient: 'bg-gradient-to-br from-white via-neutral-50/50 to-indigo-50/30 border border-neutral-200/60',
    dark: 'bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700/50 text-white',
    premium: 'bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 border border-indigo-200/40'
  };

  const hoverEffects = hover ? {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  const baseClasses = `
    rounded-2xl shadow-lg transition-all duration-300 relative overflow-hidden
    ${variants[variant]}
    ${hover ? 'hover:shadow-2xl cursor-pointer' : ''}
    ${glow ? 'shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20' : ''}
    ${padding}
    ${className}
  `;

  const CardComponent = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    whileHover: hoverEffects
  } : {};

  return (
    <CardComponent 
      className={baseClasses}
      {...animationProps}
      {...props}
    >
      {/* Gradient overlay for premium feel */}
      {gradient && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
        />
      )}
      
      {/* Animated background accent */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl -z-10"
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Bottom border accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </CardComponent>
  );
};