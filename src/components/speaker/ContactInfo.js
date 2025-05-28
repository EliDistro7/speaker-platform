import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { Mail, Phone, Globe, Copy, ExternalLink, Check, Sparkles } from 'lucide-react';

const translations = {
  en: {
    contactInfo: 'Contact Information',
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
    copied: 'Copied!',
    copyToClipboard: 'Copy to clipboard',
    visitWebsite: 'Visit website',
    sendEmail: 'Send email',
    callPhone: 'Call phone'
  },
  sw: {
    contactInfo: 'Maelezo ya Mawasiliano',
    email: 'Barua pepe',
    phone: 'Simu',
    website: 'Tovuti',
    copied: 'Imenakiliwa!',
    copyToClipboard: 'Nakili kwenye clipboard',
    visitWebsite: 'Tembelea tovuti',
    sendEmail: 'Tuma barua pepe',
    callPhone: 'Piga simu'
  }
};

export const ContactInfo = ({ speaker }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [copiedItem, setCopiedItem] = React.useState(null);

  const contactDetails = [
    { 
      icon: Mail, 
      text: speaker.email, 
      label: t.email,
      type: 'email',
      action: () => window.open(`mailto:${speaker.email}`, '_blank'),
      actionLabel: t.sendEmail
    },
    { 
      icon: Phone, 
      text: speaker.phone, 
      label: t.phone,
      type: 'phone',
      action: () => window.open(`tel:${speaker.phone}`, '_blank'),
      actionLabel: t.callPhone
    },
    { 
      icon: Globe, 
      text: speaker.website, 
      label: t.website,
      type: 'website',
      action: () => window.open(speaker.website.startsWith('http') ? speaker.website : `https://${speaker.website}`, '_blank'),
      actionLabel: t.visitWebsite
    }
  ].filter(detail => detail.text);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(index);
      setTimeout(() => setCopiedItem(null), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getGradientColors = (type) => {
    switch(type) {
      case 'email': return {
        bg: 'from-blue-500 via-cyan-500 to-blue-600',
        hover: 'from-blue-600 via-cyan-600 to-blue-700'
      };
      case 'phone': return {
        bg: 'from-emerald-500 via-green-500 to-teal-600',
        hover: 'from-emerald-600 via-green-600 to-teal-700'
      };
      case 'website': return {
        bg: 'from-violet-500 via-purple-500 to-indigo-600',
        hover: 'from-violet-600 via-purple-600 to-indigo-700'
      };
      default: return {
        bg: 'from-indigo-500 via-purple-500 to-pink-600',
        hover: 'from-indigo-600 via-purple-600 to-pink-700'
      };
    }
  };

  if (contactDetails.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="mb-8 relative bg-transparent backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-white/20 overflow-hidden"
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center space-x-3 mb-6 px-2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-neutral-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            {t.contactInfo}
          </h3>
          <motion.div 
            className="h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mt-1"
            initial={{ width: 0 }}
            animate={{ width: '3rem' }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Contact Details Grid */}
      <div className="space-y-3 sm:space-y-4">
        {contactDetails.map((detail, index) => {
          const colors = getGradientColors(detail.type);
          
          return (
            <motion.div
              key={index}
              className="group relative overflow-hidden"
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + index * 0.15,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
              {/* Main Card - Transparent with subtle backdrop */}
              <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm border border-white/30 group-hover:shadow-lg transition-all duration-300">
                
      
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    {/* Enhanced Icon */}
                    <div className="relative group/icon flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-lg sm:rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300`} />
                      <div className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${colors.bg} shadow-lg group-hover/icon:scale-110 transition-transform duration-300`}>
                        <detail.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white group-hover/icon:rotate-12 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Enhanced Contact Details */}
                    <div className="flex-1 min-w-0">
                      <motion.p 
                        className="text-xs sm:text-sm font-semibold text-neutral-600 mb-1 uppercase tracking-wider"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {detail.label}
                      </motion.p>
                      <p className="text-neutral-800 font-bold text-sm sm:text-base md:text-lg truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                        {detail.text}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4 flex-shrink-0">
                    {/* Copy Button */}
                    <motion.button
                      onClick={() => copyToClipboard(detail.text, index)}
                      className="relative p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl text-neutral-500 hover:text-white bg-white/40 hover:bg-gradient-to-r hover:from-neutral-600 hover:to-neutral-700 backdrop-blur-sm transition-all duration-300 group/copy"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={t.copyToClipboard}
                    >
                      <AnimatePresence mode="wait">
                        {copiedItem === index ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="text-emerald-500"
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 group-hover/copy:rotate-12 transition-transform duration-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Action Button */}
                    <motion.button
                      onClick={detail.action}
                      className={`relative p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl text-white bg-gradient-to-r ${colors.bg} hover:bg-gradient-to-r hover:${colors.hover} shadow-lg hover:shadow-xl transition-all duration-300 group/action overflow-hidden`}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: `0 10px 25px -5px rgba(99, 102, 241, 0.4)`
                      }}
                      whileTap={{ scale: 0.9 }}
                      title={detail.actionLabel}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
                      <ExternalLink className="relative h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 group-hover/action:rotate-12 group-hover/action:scale-110 transition-transform duration-200" />
                    </motion.button>
                  </div>
                </div>

                {/* Success Notification */}
                <AnimatePresence>
                  {copiedItem === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.8 }}
                      className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border-2 border-white z-10"
                    >
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{t.copied}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="mt-6 sm:mt-8 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex space-x-1.5 sm:space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};