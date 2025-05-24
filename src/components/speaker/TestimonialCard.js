import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { 
  Quote, Star, Heart, ThumbsUp, MessageCircle, 
  User, Calendar, MapPin, Award, Sparkles 
} from 'lucide-react';

const translations = {
  en: {
    testimonial: 'Testimonial',
    clientReview: 'Client Review',
    feedback: 'Feedback',
    rating: 'Rating',
    helpful: 'Helpful',
    verified: 'Verified Review',
    anonymous: 'Anonymous',
    clientSince: 'Client since',
    location: 'Location',
    occupation: 'Occupation',
    readMore: 'Read more',
    readLess: 'Show less'
  },
  sw: {
    testimonial: 'Ushuhuda',
    clientReview: 'Tathmini ya Mteja',
    feedback: 'Maoni',
    rating: 'Kiwango',
    helpful: 'Inasaidia',
    verified: 'Tathmini Iliyothibitishwa',
    anonymous: 'Asiyejulikana',
    clientSince: 'Mteja tangu',
    location: 'Mahali',
    occupation: 'Kazi',
    readMore: 'Soma zaidi',
    readLess: 'Onyesha kidogo'
  }
};

export const TestimonialCard = ({ 
  testimonial,
  variant = 'default',
  showRating = true,
  showAvatar = true,
  expandable = false,
  animated = true,
  glowEffect = false
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  // Extract testimonial data with fallbacks
  const {
    text = '',
    author = t.anonymous,
    rating = 5,
    position = '',
    company = '',
    location = '',
    date = '',
    avatar = null,
    verified = false,
    helpful = 0
  } = testimonial || {};

  // Truncate text for expandable feature
  const maxLength = 150;
  const shouldTruncate = expandable && text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? text.substring(0, maxLength) + '...' 
    : text;

  const variants = {
    default: {
      bg: 'from-white via-neutral-50/50 to-blue-50/30',
      border: 'border-neutral-200/60',
      accent: 'from-blue-500 to-cyan-600',
      text: 'text-neutral-700',
      authorText: 'text-neutral-600'
    },
    premium: {
      bg: 'from-white via-purple-50/30 to-indigo-50/40',
      border: 'border-purple-200/60',
      accent: 'from-purple-500 to-indigo-600',
      text: 'text-neutral-700',
      authorText: 'text-purple-600'
    },
    success: {
      bg: 'from-white via-green-50/30 to-emerald-50/40',
      border: 'border-green-200/60',
      accent: 'from-green-500 to-emerald-600',
      text: 'text-neutral-700',
      authorText: 'text-green-600'
    },
    warm: {
      bg: 'from-white via-orange-50/30 to-amber-50/40',
      border: 'border-orange-200/60',
      accent: 'from-orange-500 to-amber-600',
      text: 'text-neutral-700',
      authorText: 'text-orange-600'
    }
  };

  const variantStyle = variants[variant] || variants.default;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={animated ? { opacity: 0, scale: 0 } : {}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
      >
        <Star
          className={`h-4 w-4 ${
            i < rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-neutral-300'
          }`}
        />
      </motion.div>
    ));
  };

  return (
    <motion.div
      className="relative group"
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      {glowEffect && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${variantStyle.accent} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl -z-10`}
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main Card */}
      <motion.div
        className={`
          relative overflow-hidden rounded-2xl p-6 
          bg-gradient-to-br ${variantStyle.bg}
          border ${variantStyle.border}
          backdrop-blur-sm shadow-sm hover:shadow-xl
          transition-all duration-500 ease-out
        `}
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${variantStyle.accent} rounded-full transform translate-x-16 -translate-y-16`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${variantStyle.accent} rounded-full transform -translate-x-12 translate-y-12`}></div>
        </div>

        {/* Quote Icon */}
        <motion.div
          className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${variantStyle.accent} rounded-full flex items-center justify-center opacity-10 group-hover:opacity-20`}
          animate={isHovered ? { rotate: 12, scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Quote className="h-6 w-6 text-white" />
        </motion.div>

        {/* Rating */}
        {showRating && (
          <motion.div
            className="flex items-center space-x-1 mb-4"
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {renderStars(rating)}
            <span className="ml-2 text-sm font-semibold text-neutral-600">
              {rating}/5
            </span>
            {verified && (
              <motion.div
                className={`ml-2 flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${variantStyle.accent} rounded-full`}
                whileHover={{ scale: 1.05 }}
              >
                <Award className="h-3 w-3 text-white" />
                <span className="text-xs font-semibold text-white">
                  {t.verified}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Testimonial Text */}
        <motion.div
          className="relative mb-6"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <blockquote className={`${variantStyle.text} leading-relaxed text-base italic relative z-10`}>
            "{displayText}"
          </blockquote>

          {/* Expandable Feature */}
          {shouldTruncate && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-2 text-sm font-semibold bg-gradient-to-r ${variantStyle.accent} bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? t.readLess : t.readMore}
            </motion.button>
          )}

          {/* Quote decoration */}
          <motion.div
            className={`absolute -top-2 -left-2 text-6xl bg-gradient-to-r ${variantStyle.accent} bg-clip-text text-transparent opacity-20 font-serif leading-none`}
            animate={isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            "
          </motion.div>
        </motion.div>

        {/* Author Section */}
        <motion.div
          className="flex items-center justify-between"
          initial={animated ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            {showAvatar && (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${variantStyle.accent} flex items-center justify-center shadow-sm`}>
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                
                {/* Online indicator for verified users */}
                {verified && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            )}

            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${variantStyle.authorText} text-sm`}>
                {author}
              </p>
              {(position || company) && (
                <p className="text-xs text-neutral-500 truncate">
                  {position} {position && company && 'at'} {company}
                </p>
              )}
              <div className="flex items-center space-x-3 mt-1 text-xs text-neutral-400">
                {location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                  </div>
                )}
                {date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full transition-all duration-200 ${
                liked 
                  ? `bg-gradient-to-r ${variantStyle.accent} text-white shadow-md` 
                  : 'text-neutral-400 hover:text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </motion.button>

            {helpful > 0 && (
              <motion.div
                className="flex items-center space-x-1 px-2 py-1 bg-neutral-100 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <ThumbsUp className="h-3 w-3 text-neutral-500" />
                <span className="text-xs font-medium text-neutral-600">
                  {helpful}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
          initial={false}
          whileHover={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
            ],
            x: ['-100%', '100%']
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Floating Sparkles */}
        {animated && isHovered && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${15 + i * 25}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -15, -30],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-400 opacity-60" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};