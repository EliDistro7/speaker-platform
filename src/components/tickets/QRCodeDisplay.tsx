import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan, CheckCircle, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    qrCode: 'QR Code',
    scanAtEntrance: 'Scan at event entrance',
    readyToScan: 'Ready to scan',
    holdSteady: 'Hold device steady when scanning'
  },
  sw: {
    qrCode: 'Msimbo wa QR',
    scanAtEntrance: 'Changanua mlangoni',
    readyToScan: 'Tayari kuchukuliwa',
    holdSteady: 'Shika kifaa vizuri wakati wa kuchanganua'
  }
};

export const QRCodeDisplay = ({ data, size = 32 }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 h-full min-h-[400px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-gray-300 rounded-lg rotate-12" />
        <div className="absolute bottom-8 right-6 w-12 h-12 border border-gray-300 rounded-full" />
        <div className="absolute top-1/3 right-8 w-8 h-8 border border-gray-300 rounded-sm rotate-45" />
      </div>
      
      {/* Main QR container */}
      <motion.div 
        className="relative z-10 mb-6"
        variants={itemVariants}
      >
        {/* Animated scanning rings */}
        <motion.div
          className="absolute inset-0 border-4 border-indigo-200 rounded-3xl"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute inset-2 border-2 border-purple-200 rounded-2xl"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        
        {/* QR Code container */}
        <motion.div 
          className="relative bg-white p-8 rounded-3xl shadow-2xl border-4 border-gray-100"
          whileHover={{ 
            scale: 1.05,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
          style={{ 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '20px 20px 60px #d1d5db, -20px -20px 60px #ffffff'
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-indigo-400 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-indigo-400 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-indigo-400 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-indigo-400 rounded-br-lg" />
          
          {/* QR Code placeholder */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <QrCode className={`w-${size} h-${size} text-gray-700`} />
          </motion.div>
        </motion.div>
        
        {/* Scanning indicator */}
        <motion.div
          className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h3 
        variants={itemVariants}
        className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"
      >
        <Scan className="w-5 h-5 text-indigo-600" />
        {t.qrCode}
      </motion.h3>
      
      {/* Status indicator */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 mb-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-emerald-500 rounded-full"
        />
        <span className="text-sm font-semibold text-emerald-600">
          {t.readyToScan}
        </span>
      </motion.div>

      {/* Instructions */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-2"
      >
        <p className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-500" />
          {t.scanAtEntrance}
        </p>
        <p className="text-xs text-gray-500 max-w-[200px]">
          {t.holdSteady}
        </p>
      </motion.div>

      {/* Animated scan line */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60"
        animate={{
          y: [-60, 60, -60],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-60"
          style={{
            left: `${20 + i * 25}%`,
            top: `${30 + i * 15}%`
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </motion.div>
  );
};