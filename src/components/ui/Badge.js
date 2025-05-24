import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { 
  Calendar, MapPin, Clock, Users, Star, Ticket, QrCode, Download, 
  User, Mail, Phone, Globe, CheckCircle, X, Sparkles, Award, 
  Zap, Heart, Shield, Crown
} from 'lucide-react';

const translations = {
  en: {
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      featured: 'Featured',
      new: 'New',
      popular: 'Popular',
      premium: 'Premium',
      verified: 'Verified'
    }
  },
  sw: {
    status: {
      active: 'Inaendelea',
      inactive: 'Haiendelea',
      pending: 'Inasubiri',
      completed: 'Imekamilika',
      cancelled: 'Imeghairiwa',
      featured: 'Maalum',
      new: 'Mpya',
      popular: 'Maarufu',
      premium: 'Bora',
      verified: 'Imethibitishwa'
    }
  }
};

export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: IconComponent,
  animated = true,
  glow = false,
  pulsing = false,
  interactive = false,
  count,
  removable = false,
  onRemove,
  translate = false,
  statusKey
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Get translated text if statusKey is provided
  const displayText = translate && statusKey && t.status[statusKey] 
    ? t.status[statusKey] 
    : children;

  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      text: 'text-white',
      bgLight: 'from-blue-50 to-cyan-50',
      textLight: 'from-blue-600 to-cyan-700',
      border: 'border-blue-200',
      glow: 'from-blue-500/30 to-cyan-600/30'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      bgLight: 'from-green-50 to-emerald-50',
      textLight: 'from-green-600 to-emerald-700',
      border: 'border-green-200',
      glow: 'from-green-500/30 to-emerald-600/30'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      text: 'text-white',
      bgLight: 'from-amber-50 to-orange-50',
      textLight: 'from-amber-600 to-orange-700',
      border: 'border-amber-200',
      glow: 'from-amber-500/30 to-orange-600/30'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      text: 'text-white',
      bgLight: 'from-red-50 to-rose-50',
      textLight: 'from-red-600 to-rose-700',
      border: 'border-red-200',
      glow: 'from-red-500/30 to-rose-600/30'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      text: 'text-white',
      bgLight: 'from-purple-50 to-indigo-50',
      textLight: 'from-purple-600 to-indigo-700',
      border: 'border-purple-200',
      glow: 'from-purple-500/30 to-indigo-600/30'
    },
    gray: {
      bg: 'bg-gradient-to-r from-neutral-500 to-gray-600',
      text: 'text-white',
      bgLight: 'from-neutral-50 to-gray-50',
      textLight: 'from-neutral-600 to-gray-700',
      border: 'border-neutral-200',
      glow: 'from-neutral-500/30 to-gray-600/30'
    },
    premium: {
      bg: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
      text: 'text-yellow-900',
      bgLight: 'from-yellow-50 to-amber-50',
      textLight: 'from-yellow-700 to-amber-800',
      border: 'border-yellow-300',
      glow: 'from-yellow-400/40 to-amber-500/40'
    }
  };

  const sizes = {
    xs: {
      padding: 'px-2 py-0.5',
      text: 'text-xs',
      iconSize: 'h-3 w-3',
      gap: 'space-x-1'
    },
    sm: {
      padding: 'px-3 py-1',
      text: 'text-xs',
      iconSize: 'h-3 w-3',
      gap: 'space-x-1.5'
    },
    md: {
      padding: 'px-4 py-1.5',
      text: 'text-sm',
      iconSize: 'h-4 w-4',
      gap: 'space-x-2'
    },
    lg: {
      padding: 'px-5 py-2',
      text: 'text-base',
      iconSize: 'h-5 w-5',
      gap: 'space-x-2'
    },
    xl: {
      padding: 'px-6 py-3',
      text: 'text-lg',
      iconSize: 'h-6 w-6',
      gap: 'space-x-3'
    }
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  const handleRemove = () => {
    if (onRemove) {
      setIsRemoving(true);
      setTimeout(() => onRemove(), 200);
    }
  };

  const getRandomSparkleIcon = () => {
    const sparkleIcons = [Sparkles, Award, Zap, Heart, Shield, Crown];
    return sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
  };

  const SparkleIcon = getRandomSparkleIcon();

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          className="relative inline-flex items-center group"
          initial={animated ? { opacity: 0, scale: 0.8, y: 10 } : {}}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: -20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          whileHover={interactive ? { scale: 1.05, y: -2 } : {}}
          whileTap={interactive ? { scale: 0.98 } : {}}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Glow effect */}
          {glow && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${variantStyle.glow} rounded-full blur-md opacity-0 group-hover:opacity-100 -z-10`}
              animate={pulsing ? { 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              } : {}}
              transition={pulsing ? { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              } : { duration: 0.3 }}
            />
          )}

          {/* Main badge */}
          <motion.div
            className={`
              relative overflow-hidden rounded-full font-semibold
              ${sizeStyle.padding} ${sizeStyle.text} ${sizeStyle.gap}
              ${isHovered ? variantStyle.bg : `bg-gradient-to-r ${variantStyle.bgLight}`}
              ${isHovered ? variantStyle.text : `bg-clip-text text-transparent bg-gradient-to-r ${variantStyle.textLight}`}
              border ${variantStyle.border}
              backdrop-blur-sm shadow-sm hover:shadow-lg
              transition-all duration-300 ease-out
              flex items-center justify-center
            `}
            animate={pulsing ? { 
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0)',
                '0 0 0 4px rgba(59, 130, 246, 0.1)',
                '0 0 0 0 rgba(59, 130, 246, 0)'
              ]
            } : {}}
            transition={pulsing ? { 
              duration: 2, 
              repeat: Infinity 
            } : {}}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full transform translate-x-2 -translate-y-2"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rounded-full transform -translate-x-1 translate-y-1"></div>
            </div>

            {/* Content */}
            <div className="relative flex items-center">
              {/* Icon */}
              {IconComponent && (
                <motion.div
                  animate={animated ? { rotate: isHovered ? 12 : 0 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className={`${sizeStyle.iconSize} ${isHovered ? 'text-current' : ''}`} />
                </motion.div>
              )}

              {/* Text */}
              <span className="font-semibold whitespace-nowrap">
                {displayText}
              </span>

              {/* Count */}
              {count && (
                <motion.div
                  className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {count}
                </motion.div>
              )}

              {/* Remove button */}
              {removable && (
                <motion.button
                  onClick={handleRemove}
                  className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-white/20 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </div>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-30"
              initial={false}
              whileHover={{
                background: [
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
                ],
                x: ['-100%', '100%']
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Floating sparkles */}
          {animated && isHovered && (
            <motion.div className="absolute inset-0 pointer-events-none">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 40}%`,
                    top: `${10 + i * 30}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -10, -20],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                >
                  <SparkleIcon className="h-2 w-2 text-current opacity-60" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};