import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    title: 'No tickets yet',
    subtitle: 'Your event journey starts here',
    description: 'Discover amazing events and experiences waiting for you. From concerts to conferences, workshops to festivals - find your next adventure.',
    browseEvents: 'Browse Events',
    exploreNow: 'Explore Now'
  },
  sw: {
    title: 'Bado hakuna tiketi',
    subtitle: 'Safari yako ya matukio inaanza hapa',
    description: 'Gundua matukio mazuri na uzoefu unaokungoja. Kutoka tamasha hadi mikutano, warsha hadi sherehe - pata safari yako inayofuata.',
    browseEvents: 'Tazama Matukio',
    exploreNow: 'Chunguza Sasa'
  }
};

export const EmptyTicketsState = ({ onBrowseEvents }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background gradient and decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl" />
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-30 blur-xl" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-pink-100 to-amber-100 rounded-full opacity-40 blur-lg" />
      
      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-8 left-8 text-indigo-300 opacity-60"
        variants={floatingVariants}
        animate="animate"
      >
        <Calendar className="w-6 h-6" />
      </motion.div>
      
      <motion.div
        className="absolute top-12 right-12 text-purple-300 opacity-50"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      {/* Main content */}
      <div className="relative text-center p-16 max-w-2xl mx-auto">
        {/* Main icon */}
        <motion.div
          variants={itemVariants}
          className="relative mx-auto mb-8"
        >
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
            whileHover={{ 
              scale: 1.05,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Ticket className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute -top-2 -right-2 text-amber-400"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t.title}
          </h3>
          <p className="text-lg font-medium text-gray-600 mb-4">
            {t.subtitle}
          </p>
          <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
            {t.description}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={onBrowseEvents}
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t.browseEvents}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
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

          <motion.button
            className="group text-indigo-600 font-semibold px-8 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              {t.exploreNow}
              <motion.div
                className="group-hover:rotate-45 transition-transform duration-300"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </span>
          </motion.button>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-12 flex justify-center space-x-2"
          variants={itemVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};