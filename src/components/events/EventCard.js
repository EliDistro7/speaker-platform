import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EventImage } from './EventImage';
import { EventDetails } from './EventDetails';
import { ProgressBar } from './ProgressBar';

const translations = {
  en: {
    register: 'Register',
    spotsLeft: 'spots left',
    soldOut: 'Sold Out',
    almostFull: 'Almost Full',
    availableSpots: 'Available Spots',
    earlyBird: 'Early Bird',
    premium: 'Premium Event'
  },
  sw: {
    register: 'Jisajili',
    spotsLeft: 'nafasi zilizobaki',
    soldOut: 'Zimekwisha',
    almostFull: 'Karibu Kujaa',
    availableSpots: 'Nafasi Zinazopatikana',
    earlyBird: 'Mapema',
    premium: 'Tukio la Hali ya Juu'
  }
};

export const EventCard = ({ event, onRegister }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const availableSpots = event.capacity - event.registered;
  const isAlmostFull = availableSpots <= event.capacity * 0.2;
  const isSoldOut = availableSpots <= 0;
  const fillPercentage = (event.registered / event.capacity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300" padding="p-0">
        {/* Gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="md:flex relative">
          {/* Image Section */}
          <div className="md:w-1/3 relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <EventImage src={event.image} alt={event.title} />
              
              {/* Price Badge */}
              <motion.div 
                className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm"
                initial={{ scale: 0, rotate: 12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-lg font-bold">${event.price}</span>
              </motion.div>

              {/* Status Badge */}
              {(isSoldOut || isAlmostFull) && (
                <motion.div 
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    isSoldOut 
                      ? 'bg-red-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {isSoldOut ? t.soldOut : t.almostFull}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:w-2/3 relative">
            {/* Header */}
            <motion.div 
              className="flex justify-between items-start mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent mb-2 group-hover:from-indigo-900 group-hover:via-purple-800 group-hover:to-indigo-700 transition-all duration-300">
                  {event.title}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </div>
              
              {/* Premium badge if high price */}
              {event.price > 100 && (
                <motion.div 
                  className="flex items-center space-x-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Star className="w-3 h-3" />
                  <span>{t.premium}</span>
                </motion.div>
              )}
            </motion.div>
            
            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-neutral-700 leading-relaxed mb-6 font-medium">
                {event.description}
              </p>
            </motion.div>
            
            {/* Event Details */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <EventDetails event={event} />
            </motion.div>

            {/* Progress Section */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-neutral-700">
                    {t.availableSpots}
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {availableSpots} {t.spotsLeft}
                </span>
              </div>
              <ProgressBar 
                current={event.registered} 
                total={event.capacity} 
                className="mb-2"
              />
              <div className="text-xs text-neutral-500 text-center">
                {event.registered} / {event.capacity} registered
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-end"
            >
              <Button 
                onClick={() => onRegister(event)}
                disabled={isSoldOut}
                className={`
                  relative overflow-hidden group/btn
                  ${isSoldOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105'
                  }
                `}
              >
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={!isSoldOut ? { scale: 1.05 } : {}}
                  whileTap={!isSoldOut ? { scale: 0.95 } : {}}
                >
                  <Ticket className="w-4 h-4" />
                  <span className="font-semibold">
                    {isSoldOut ? t.soldOut : t.register}
                  </span>
                </motion.div>
                
                {!isSoldOut && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                )}
              </Button>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
              <Calendar className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>
        
        {/* Animated border accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </Card>
    </motion.div>
  );
};