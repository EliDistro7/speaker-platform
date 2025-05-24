import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/language';


const translations = {
  en: {
    registered: 'registered',
    duration: 'Duration',
    location: 'Location',
    date: 'Date',
    time: 'Time',
    capacity: 'Capacity',
    imageError: 'Image could not be loaded'
  },
  sw: {
    registered: 'wamejisajili',
    duration: 'Muda',
    location: 'Mahali',
    date: 'Tarehe',
    time: 'Muda',
    capacity: 'Uwezo',
    imageError: 'Picha haikuweza kupakiwa'
  }
};
export const EventImage = ({ 
  src, 
  alt, 
  className = '',
  showOverlay = true,
  aspectRatio = 'aspect-video',
  quality = 'high'
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  
  const qualityClass = quality === 'high' 
    ? 'w-full h-64 md:h-full object-cover'
    : 'w-full h-48 md:h-64 object-cover';
  
  return (
    <motion.div 
      className={`relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Loading State */}
      {!imageLoaded && !imageError && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200"
          animate={{ 
            background: [
              'linear-gradient(45deg, #f5f5f5, #e5e5e5)',
              'linear-gradient(45deg, #e5e5e5, #f5f5f5)',
              'linear-gradient(45deg, #f5f5f5, #e5e5e5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"
          />
        </motion.div>
      )}
      
      {/* Error State */}
      {imageError && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageIcon className="w-12 h-12 mb-3 text-neutral-400" />
          <p className="text-sm font-medium text-center px-4">
            {t.imageError}
          </p>
        </motion.div>
      )}
      
      {/* Main Image */}
      <motion.img 
        src={src} 
        alt={alt} 
        className={`${qualityClass} transition-all duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        initial={{ scale: 1.1 }}
        animate={{ scale: imageLoaded ? 1 : 1.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Gradient Overlay */}
      {showOverlay && imageLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
      
      {/* Decorative corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        initial={false}
      />
      
      {/* Bottom shine effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  );
};