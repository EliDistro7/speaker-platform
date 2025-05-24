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

export const EventDetails = ({ event, layout = 'grid', showLabels = false }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const details = [
    { 
      icon: Calendar, 
      text: event.date,
      label: t.date,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      icon: Clock, 
      text: `${event.time} (${event.duration})`,
      label: t.time,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      icon: MapPin, 
      text: event.location,
      label: t.location,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Users, 
      text: `${event.registered}/${event.capacity} ${t.registered}`,
      label: t.capacity,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];
  
  const containerClass = layout === 'stack' 
    ? 'space-y-3' 
    : 'grid md:grid-cols-2 gap-4';
  
  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {details.map((detail, index) => (
        <motion.div 
          key={index} 
          className="group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200/40 hover:border-neutral-300/60 transition-all duration-200 hover:shadow-md group-hover:shadow-lg">
            {/* Icon Container */}
            <motion.div 
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${detail.bgColor} group-hover:scale-110 transition-transform duration-200`}
              whileHover={{ rotate: 5 }}
            >
              <detail.icon className={`w-5 h-5 ${detail.color}`} />
            </motion.div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {showLabels && (
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                  {detail.label}
                </div>
              )}
              <span className="text-neutral-700 font-medium leading-relaxed block truncate">
                {detail.text}
              </span>
            </div>
            
            {/* Hover accent */}
            <motion.div
              className="w-1 h-8 bg-gradient-to-b from-transparent via-neutral-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={false}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};