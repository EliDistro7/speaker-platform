import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { User, Quote } from 'lucide-react';

const translations = {
  en: {
    about: 'About',
    readMore: 'Read more',
    readLess: 'Read less'
  },
  sw: {
    about: 'Kuhusu',
    readMore: 'Soma zaidi',
    readLess: 'Soma kidogo'
  }
};

export const SpeakerBio = ({ bio, showExpandable = true, maxLength = 300 }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const shouldShowExpandable = showExpandable && bio && bio.length > maxLength;
  const displayBio = shouldShowExpandable && !isExpanded 
    ? bio.substring(0, maxLength) + '...'
    : bio;

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center space-x-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
            {t.about}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1"></div>
        </div>
      </motion.div>

      {/* Bio Content */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Quote decoration */}
        <div className="absolute -top-2 -left-2 opacity-10">
          <Quote className="h-8 w-8 text-indigo-500 transform rotate-180" />
        </div>
        
        {/* Bio text container */}
        <div className="relative bg-gradient-to-br from-white via-neutral-50/50 to-indigo-50/30 rounded-2xl p-6 shadow-sm border border-neutral-200/60 backdrop-blur-sm">
          <motion.p 
            className="text-neutral-700 leading-relaxed text-base lg:text-lg font-medium"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {displayBio}
          </motion.p>
          
          {/* Expand/Collapse Button */}
          {shouldShowExpandable && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isExpanded ? t.readLess : t.readMore}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.button>
          )}
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-5">
            <Quote className="h-6 w-6 text-indigo-500" />
          </div>
        </div>
        
        {/* Animated background accent */}
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
      </motion.div>
      
      {/* Bottom accent line */}
      <motion.div
        className="mt-6 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  );
};