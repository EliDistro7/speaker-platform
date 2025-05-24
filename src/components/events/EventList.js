import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';

import { EventCard } from './EventCard';

const translations = {
  en: {
    upcomingEvents: 'Upcoming Events',
    transformativeSeminars: 'Join our transformative seminars and workshops',
    progress: 'Progress',
    available: 'Available',
    registered: 'Registered',
    almostFull: 'Almost Full',
    soldOut: 'Sold Out',
    eventsFound: 'events found',
    noEvents: 'No events available at the moment',
    checkBackSoon: 'Check back soon for exciting new events!'
  },
  sw: {
    upcomingEvents: 'Matukio Yajayo',
    transformativeSeminars: 'Jiunge na semina na warsha zetu za kubadilisha maisha',
    progress: 'Maendeleo',
    available: 'Zinazopatikana',
    registered: 'Wamejisajili',
    almostFull: 'Karibu Kujaa',
    soldOut: 'Zimekwisha',
    eventsFound: 'matukio yamepatikana',
    noEvents: 'Hakuna matukio kwa sasa',
    checkBackSoon: 'Rudi hivi karibuni kwa matukio mapya ya kusisimua!'
  }
};

export const ProgressBar = ({ 
  current, 
  total, 
  className = '',
  showPercentage = false,
  showLabels = false,
  variant = 'default',
  animated = true,
  size = 'md'
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const percentage = Math.min((current / total) * 100, 100);
  const isAlmostFull = percentage >= 80;
  const isFull = percentage >= 100;
  
  const variants = {
    default: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600'
  };
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (isFull) return 'danger';
    if (isAlmostFull) return 'warning';
    return 'default';
  };
  
  const currentVariant = getVariant();
  
  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Labels */}
      {showLabels && (
        <motion.div 
          className="flex justify-between items-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-sm font-medium text-neutral-600">
            {t.progress}
          </span>
          <span className="text-sm font-bold text-neutral-700">
            {current}/{total}
          </span>
        </motion.div>
      )}
      
      {/* Progress Bar Container */}
      <div className={`relative w-full bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-full ${sizes[size]} overflow-hidden shadow-inner`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Progress Fill */}
        <motion.div 
          className={`${sizes[size]} rounded-full relative overflow-hidden ${variants[currentVariant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.2 : 0, 
            ease: "easeOut",
            delay: 0.2 
          }}
        >
          {/* Animated shine effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          )}
          
          {/* Pulse effect for almost full */}
          {isAlmostFull && animated && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
        
        {/* Percentage indicator */}
        {showPercentage && percentage > 10 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <span className="text-xs font-bold text-white drop-shadow-sm">
              {Math.round(percentage)}%
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Status text */}
      {showLabels && (
        <motion.div 
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className={`text-xs font-semibold ${
            isFull ? 'text-red-600' : 
            isAlmostFull ? 'text-amber-600' : 
            'text-indigo-600'
          }`}>
            {isFull ? t.soldOut : 
             isAlmostFull ? t.almostFull : 
             `${total - current} ${t.available}`}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export const EventsList = ({ 
  events, 
  onRegister,
  title,
  subtitle,
  layout = 'list',
  showStats = true
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const displayTitle = title || t.upcomingEvents;
  const displaySubtitle = subtitle || t.transformativeSeminars;
  
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRegistered = events.reduce((sum, event) => sum + event.registered, 0);
  const availableSpots = totalCapacity - totalRegistered;
  
  const containerClass = layout === 'grid' 
    ? 'grid md:grid-cols-2 gap-6' 
    : 'space-y-6';
  
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center justify-center space-x-3 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
              {displayTitle}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2 mx-auto"></div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-indigo-500" />
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="text-neutral-600 text-lg font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {displaySubtitle}
        </motion.p>
        
        {/* Stats Section */}
        {showStats && totalEvents > 0 && (
          <motion.div 
            className="flex justify-center items-center space-x-8 mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/40 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalEvents}</div>
              <div className="text-xs text-neutral-600 font-medium">{t.eventsFound}</div>
            </div>
            <div className="w-px h-8 bg-indigo-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{availableSpots}</div>
              <div className="text-xs text-neutral-600 font-medium">{t.available}</div>
            </div>
            <div className="w-px h-8 bg-purple-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{totalRegistered}</div>
              <div className="text-xs text-neutral-600 font-medium">{t.registered}</div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Events List */}
      {events.length > 0 ? (
        <motion.div 
          className={containerClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + (index * 0.1),
                ease: "easeOut"
              }}
            >
              <EventCard event={event} onRegister={onRegister} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Empty State
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 mx-auto mb-6">
            <Calendar className="h-10 w-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-600 mb-2">
            {t.noEvents}
          </h3>
          <p className="text-neutral-500">
            {t.checkBackSoon}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};