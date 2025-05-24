import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Sparkles, Shield, Ticket } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { TicketInfo } from './TicketInfo';
import { QRCodeDisplay } from './QRCodeDisplay';

const translations = {
  en: {
    active: 'Active',
    verified: 'Verified',
    downloadTicket: 'Download Ticket',
    validTicket: 'Valid Ticket',
    readyToUse: 'Ready to use'
  },
  sw: {
    active: 'Inatumika',
    verified: 'Imethibitishwa',
    downloadTicket: 'Pakua Tiketi',
    validTicket: 'Tiketi Halali',
    readyToUse: 'Tayari kutumika'
  }
};

export const TicketCard = ({ ticket, onDownload }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-white border border-gray-200/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-100/40 via-purple-50/30 to-transparent rounded-full blur-2xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/30 via-blue-50/20 to-transparent rounded-full blur-xl opacity-50" />
        
        {/* Premium ticket-style perforated edge */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-100 rounded-r-full border-r border-gray-200/80" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-100 rounded-l-full border-l border-gray-200/80" />
        
        <div className="md:flex relative z-10">
          {/* Main content section */}
          <div className="p-10 md:w-2/3 relative">
            {/* Header with title and status */}
            <motion.div 
              variants={contentVariants}
              className="flex items-start justify-between mb-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Ticket className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {t.validTicket}
                  </span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  {ticket.eventTitle}
                </h2>
              </div>
              
              <motion.div
                className="flex flex-col items-end gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">{t.active}</span>
                </motion.div>
                
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  <span>{t.verified}</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Ticket info section */}
            <motion.div 
              variants={contentVariants}
              className="mb-8"
            >
              <TicketInfo ticket={ticket} />
            </motion.div>

            {/* Status indicator */}
            <motion.div
              variants={contentVariants}
              className="mb-6 flex items-center gap-2 text-emerald-600"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-emerald-500 rounded-full"
              />
              <span className="text-sm font-medium">{t.readyToUse}</span>
            </motion.div>

            {/* Download button */}
            <motion.button
              variants={contentVariants}
              onClick={() => onDownload(ticket)}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Download className="w-5 h-5" />
                </motion.div>
                {t.downloadTicket}
              </span>
              
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ 
                  x: '100%',
                  transition: { duration: 0.6 }
                }}
              />
            </motion.button>
          </div>
          
          {/* QR Code section */}
          <motion.div 
            className="md:w-1/3 relative"
            variants={contentVariants}
            transition={{ delay: 0.4 }}
          >
            <QRCodeDisplay data={ticket.qrCode} />
          </motion.div>
        </div>
        
        {/* Floating sparkles */}
        <motion.div
          className="absolute top-6 right-6 text-amber-300 opacity-60"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.div>
  );
};