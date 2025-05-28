import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan, CheckCircle, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import QRCode from 'react-qr-code';

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

export const QRCodeDisplay = ({ data, size = 200 }) => {
  console.log('QR code data:', data);
  const { language } = useLanguage();
  const t = translations[language];

  // Create QR code data string from ticket information
  const qrData = JSON.stringify({
    ticketId: data?.id,
    eventId: data?.eventId,
    eventTitle: data?.eventTitle,
    name: data?.name,
    email: data?.email,
    phone: data?.phone,
    quantity: data?.quantity,
    purchaseDate: data?.purchaseDate,
    validationCode: `TKT-${data?.id}-${data?.eventId}`
  });

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

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 h-full min-h-[400px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-gray-300 rounded-lg rotate-12" />
        <div className="absolute bottom-8 right-6 w-12 h-12 border border-gray-300 rounded-full" />
        <div className="absolute top-1/3 right-8 w-8 h-8 border border-gray-300 rounded-sm rotate-45" />
      </div>
      
      {/* Main QR container */}
      <motion.div 
        className="relative z-10 mb-6"
        variants={itemVariants}
      >
        {/* QR Code container */}
        <motion.div 
          className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-indigo-400 rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-indigo-400 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-indigo-400 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-indigo-400 rounded-br" />
          
          {/* Actual QR Code */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data ? (
              <QRCode
                value={qrData}
                size={size}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-48 h-48 bg-gray-100 rounded-lg">
                <QrCode className="w-16 h-16 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">No ticket data</span>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Validation indicator */}
        <motion.div
          className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Ticket Information */}
      {data && (
        <motion.div
          variants={itemVariants}
          className="text-center mb-4 space-y-1"
        >
          <h4 className="font-semibold text-gray-800">{data.eventTitle}</h4>
          <p className="text-sm text-gray-600">{data.name}</p>
          <p className="text-xs text-gray-500">Ticket ID: {data.id}</p>
        </motion.div>
      )}

      {/* Title */}
      <motion.h3 
        variants={itemVariants}
        className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2"
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
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-emerald-500 rounded-full"
        />
        <span className="text-sm font-medium text-emerald-600">
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
        <p className="text-xs text-gray-500 max-w-[250px]">
          {t.holdSteady}
        </p>
      </motion.div>
    </motion.div>
  );
};