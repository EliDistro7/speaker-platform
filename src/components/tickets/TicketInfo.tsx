import React from 'react';
import { motion } from 'framer-motion';
import { Hash, User, Calendar, MapPin, Clock, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { useState } from 'react';

const translations = {
  en: {
    ticketId: 'Ticket ID',
    attendee: 'Attendee',
    dateTime: 'Date & Time',
    location: 'Location',
    time: 'Time',
    copied: 'Copied!',
    copyId: 'Copy ticket ID'
  },
  sw: {
    ticketId: 'Kitambulisho cha Tiketi',
    attendee: 'Mhudhuria',
    dateTime: 'Tarehe na Muda',
    location: 'Mahali',
    time: 'Muda',
    copied: 'Imenakiliwa!',
    copyId: 'Nakili kitambulisho cha tiketi'
  }
};

export const TicketInfo = ({ ticket }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(ticket.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy ticket ID');
    }
  };

  const info = [
    { 
      label: t.ticketId, 
      value: ticket.id, 
      mono: true,
      icon: Hash,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      copyable: true
    },
    { 
      label: t.attendee, 
      value: ticket.attendeeName,
      icon: User,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: t.dateTime, 
      value: `${ticket.eventDate} ${t.time} ${ticket.eventTime}`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: t.location, 
      value: ticket.eventLocation,
      icon: MapPin,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {info.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="group relative"
          whileHover={{ y: -2 }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 rounded-2xl p-5 hover:border-gray-300/80 hover:shadow-lg transition-all duration-300">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Header with icon and label */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}
                whileHover={{ rotate: 5 }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </motion.div>
              
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
              
              {/* Copy button for ticket ID */}
              {item.copyable && (
                <motion.button
                  onClick={handleCopyId}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={t.copyId}
                >
                  <motion.div
                    animate={{ scale: copiedId ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </motion.div>
                </motion.button>
              )}
            </div>
            
            {/* Value */}
            <div className="relative z-10">
              <motion.p 
                className={`${item.mono ? 'font-mono text-base' : 'font-bold text-lg'} text-gray-800 leading-relaxed break-words`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.value}
              </motion.p>
            </div>
            
            {/* Hover accent line */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{ 
                x: '100%',
                transition: { duration: 0.6 }
              }}
            />
          </div>
          
          {/* Success notification for copy */}
          {item.copyable && copiedId && (
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              {t.copied}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};