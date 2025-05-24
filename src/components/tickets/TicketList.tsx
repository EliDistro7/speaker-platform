import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { TicketCard } from './TicketCard';
import { EmptyTicketsState } from './EmptyTicketState';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    myTickets: 'My Tickets',
    purchasedTickets: 'Your purchased event tickets',
    totalTickets: 'Total Tickets',
    activeTickets: 'Active',
    expiredTickets: 'Expired'
  },
  sw: {
    myTickets: 'Tiketi Zangu',
    purchasedTickets: 'Tiketi zako za matukio ulizozinunua',
    totalTickets: 'Jumla ya Tiketi',
    activeTickets: 'Hai',
    expiredTickets: 'Zimeisha'
  }
};

export const TicketsList = ({ tickets, onDownload, onBrowseEvents }) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Calculate ticket statistics
  const activeTickets = tickets.filter(ticket => 
    new Date(ticket.eventDate) > new Date()
  ).length;
  const expiredTickets = tickets.length - activeTickets;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="text-center mb-8"
        variants={headerVariants}
      >
        <div className="flex items-center justify-center mb-4">
          <motion.div
            className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4"
            whileHover={{ 
              scale: 1.05,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <Ticket className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t.myTickets}
        </motion.h1>
        
        <motion.p 
          className="text-neutral-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.purchasedTickets}
        </motion.p>
      </motion.div>

      {/* Statistics Cards (only show if tickets exist) */}
      {tickets.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          variants={statsVariants}
        >
          {/* Total Tickets */}
          <motion.div
            className="bg-gradient-to-br from-white to-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-md"
            whileHover={{ 
              y: -4,
              shadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  {t.totalTickets}
                </p>
                <p className="text-3xl font-bold text-neutral-800 mt-1">
                  {tickets.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          {/* Active Tickets */}
          <motion.div
            className="bg-gradient-to-br from-white to-success-50 rounded-xl p-6 border border-success-200 shadow-md"
            whileHover={{ 
              y: -4,
              shadow: "0 20px 40px rgba(16,185,129,0.15)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success-600 uppercase tracking-wide">
                  {t.activeTickets}
                </p>
                <p className="text-3xl font-bold text-success-700 mt-1">
                  {activeTickets}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          {/* Expired Tickets */}
          <motion.div
            className="bg-gradient-to-br from-white to-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-md"
            whileHover={{ 
              y: -4,
              shadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  {t.expiredTickets}
                </p>
                <p className="text-3xl font-bold text-neutral-600 mt-1">
                  {expiredTickets}
                </p>
              </div>
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tickets Grid or Empty State */}
      {tickets.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyTicketsState onBrowseEvents={onBrowseEvents} />
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6"
          variants={containerVariants}
        >
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <TicketCard 
                ticket={ticket} 
                onDownload={onDownload}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Action Hint */}
      {tickets.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          <motion.div
            className="bg-primary-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Tap tickets to download
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};