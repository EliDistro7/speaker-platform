import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    close: 'Close',
    closeModal: 'Close modal'
  },
  sw: {
    close: 'Funga',
    closeModal: 'Funga kidirisha'
  }
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: 'easeOut',
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-neutral-800/50 to-neutral-900/60 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div 
            className={`relative bg-white rounded-3xl ${maxWidth} w-full max-h-[90vh] overflow-hidden shadow-2xl ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 opacity-60" />
            
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-100">
              <div className="flex justify-between items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                    {title}
                  </h2>
                </motion.div>
                
                {showCloseButton && (
                  <motion.button 
                    onClick={onClose}
                    className="group relative p-2 rounded-xl bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-500 hover:text-neutral-700 transition-all duration-200"
                    aria-label={t.closeModal}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-10 right-0 px-2 py-1 bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {t.close}
                      <div className="absolute -top-1 right-2 w-2 h-2 bg-neutral-800 transform rotate-45" />
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Content */}
            <motion.div 
              className="relative p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Custom scrollbar styles */}
              <style jsx>{`
                .overflow-y-auto::-webkit-scrollbar {
                  width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>
              
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};