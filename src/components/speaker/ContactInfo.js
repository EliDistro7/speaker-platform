import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { Mail, Phone, Globe, Copy, ExternalLink, Check } from 'lucide-react';

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
  ].filter(detail => detail.text); // Only show items that have values

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(index);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getGradientColors = (type) => {
    switch(type) {
      case 'email': return 'from-blue-500 to-cyan-600';
      case 'phone': return 'from-green-500 to-emerald-600';
      case 'website': return 'from-purple-500 to-indigo-600';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  if (contactDetails.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8"
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center space-x-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
            {t.contactInfo}
          </h3>
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1"></div>
        </div>
      </motion.div>

      {/* Contact Details */}
      <div className="space-y-4">
        {contactDetails.map((detail, index) => (
          <motion.div
            key={index}
            className="group relative bg-gradient-to-br from-white via-neutral-50/50 to-indigo-50/30 rounded-xl p-4 shadow-sm border border-neutral-200/60 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Icon with gradient background */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${getGradientColors(detail.type)} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                  <detail.icon className="h-5 w-5 text-white" />
                </div>
                
                {/* Contact details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    {detail.label}
                  </p>
                  <p className="text-neutral-800 font-semibold truncate group-hover:text-indigo-700 transition-colors duration-200">
                    {detail.text}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 ml-4">
                {/* Copy button */}
                <motion.button
                  onClick={() => copyToClipboard(detail.text, index)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={t.copyToClipboard}
                >
                  <AnimatePresence mode="wait">
                    {copiedItem === index ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Action button (email, call, visit) */}
                <motion.button
                  onClick={detail.action}
                  className={`p-2 rounded-lg text-white bg-gradient-to-r ${getGradientColors(detail.type)} hover:shadow-lg transition-all duration-200 group/btn`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={detail.actionLabel}
                >
                  <ExternalLink className="h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                </motion.button>
              </div>
            </div>

            {/* Copied feedback */}
            <AnimatePresence>
              {copiedItem === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg"
                >
                  {t.copied}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${getGradientColors(detail.type)} opacity-0 rounded-xl blur-xl -z-10`}
              whileHover={{ opacity: 0.1, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-6 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
    </motion.div>
  );
};