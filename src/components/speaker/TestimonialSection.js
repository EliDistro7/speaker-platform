import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { TestimonialCard } from './TestimonialCard';
import { 
  MessageCircle, Star, Users, Filter, Grid3X3, 
  List, ChevronLeft, ChevronRight, Quote, 
  Award, TrendingUp, Heart, Eye
} from 'lucide-react';

const translations = {
  en: {
    title: 'What People Say',
    subtitle: 'Client Testimonials & Reviews',
    description: 'Hear from our satisfied clients about their experiences',
    allTestimonials: 'All Reviews',
    verified: 'Verified Only',
    recent: 'Most Recent',
    topRated: 'Top Rated',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    showingResults: 'Showing {count} of {total} testimonials',
    noTestimonials: 'No testimonials available',
    loadMore: 'Load More',
    viewAll: 'View All',
    gridView: 'Grid View',
    listView: 'List View',
    averageRating: 'Average Rating',
    totalReviews: 'Total Reviews',
    satisfactionRate: 'Satisfaction Rate'
  },
  sw: {
    title: 'Watu Wanasema Nini',
    subtitle: 'Ushuhuda na Tathmini za Wateja',
    description: 'Sikia kutoka kwa wateja wetu walioridhika kuhusu uzoefu wao',
    allTestimonials: 'Tathmini Zote',
    verified: 'Zilizothibitishwa Tu',
    recent: 'Za Hivi Karibuni',
    topRated: 'Zilizo Bora',
    filterBy: 'Chuja kwa',
    sortBy: 'Panga kwa',
    showingResults: 'Kuonyesha {count} kati ya {total} ushuhuda',
    noTestimonials: 'Hakuna ushuhuda unapatikana',
    loadMore: 'Pakia Zaidi',
    viewAll: 'Ona Zote',
    gridView: 'Mchoro wa Grid',
    listView: 'Mchoro wa Orodha',
    averageRating: 'Kiwango cha Wastani',
    totalReviews: 'Jumla ya Tathmini',
    satisfactionRate: 'Kiwango cha Kuridhika'
  }
};

export const TestimonialsSection = ({ 
  testimonials = [],
  showStats = true,
  showFilters = true,
  itemsPerPage = 6,
  variant = 'default',
  animated = true,
  autoPlay = false,
  showViewToggle = true
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter options
  const filterOptions = [
    { key: 'all', label: t.allTestimonials, icon: MessageCircle },
    { key: 'verified', label: t.verified, icon: Award },
    { key: 'topRated', label: t.topRated, icon: Star }
  ];

  // Sort options
  const sortOptions = [
    { key: 'recent', label: t.recent },
    { key: 'topRated', label: t.topRated },
    { key: 'helpful', label: 'Most Helpful' }
  ];

  // Filter and sort testimonials
  const processedTestimonials = React.useMemo(() => {
    let filtered = [...testimonials];

    // Apply filters
    if (filter === 'verified') {
      filtered = filtered.filter(t => t.verified);
    } else if (filter === 'topRated') {
      filtered = filtered.filter(t => (t.rating || 0) >= 4);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'topRated':
          return (b.rating || 0) - (a.rating || 0);
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        case 'recent':
        default:
          return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });

    return filtered;
  }, [testimonials, filter, sortBy]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalReviews = testimonials.length;
    const avgRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / totalReviews || 0;
    const satisfactionRate = (testimonials.filter(t => (t.rating || 0) >= 4).length / totalReviews * 100) || 0;
    
    return {
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      satisfactionRate: Math.round(satisfactionRate)
    };
  }, [testimonials]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && processedTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % Math.ceil(processedTestimonials.length / 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, processedTestimonials.length]);

  const variants = {
    default: {
      bg: 'from-white via-neutral-50/50 to-blue-50/30',
      accent: 'from-blue-500 to-cyan-600',
      headerBg: 'from-blue-50 to-cyan-50'
    },
    premium: {
      bg: 'from-white via-purple-50/30 to-indigo-50/40',
      accent: 'from-purple-500 to-indigo-600',
      headerBg: 'from-purple-50 to-indigo-50'
    },
    warm: {
      bg: 'from-white via-orange-50/30 to-amber-50/40',
      accent: 'from-orange-500 to-amber-600',
      headerBg: 'from-orange-50 to-amber-50'
    }
  };

  const variantStyle = variants[variant] || variants.default;

  if (!testimonials || testimonials.length === 0) {
    return (
      <motion.div
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 bg-gradient-to-br ${variantStyle.bg} border border-neutral-200/60 text-center`}
      >
        <MessageCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <p className="text-neutral-600">{t.noTestimonials}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 30 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${variantStyle.headerBg} border border-neutral-200/60`}
        initial={animated ? { opacity: 0, scale: 0.95 } : {}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${variantStyle.accent} rounded-full transform translate-x-20 -translate-y-20`}></div>
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${variantStyle.accent} rounded-full transform -translate-x-16 translate-y-16`}></div>
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            {/* Title with Icon */}
            <motion.div 
              className="flex items-center space-x-4 mb-4"
              initial={animated ? { opacity: 0, x: -20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${variantStyle.accent} shadow-lg`}>
                <Quote className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                  {t.title}
                </h2>
                <p className="text-lg text-neutral-600 mt-1">{t.subtitle}</p>
                <div className={`h-1 w-16 bg-gradient-to-r ${variantStyle.accent} rounded-full mt-2`}></div>
              </div>
            </motion.div>

            <motion.p
              className="text-neutral-600 max-w-2xl"
              initial={animated ? { opacity: 0, y: 10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {t.description}
            </motion.p>
          </div>

          {/* Stats Section */}
          {showStats && (
            <motion.div
              className="mt-6 lg:mt-0 lg:ml-8"
              initial={animated ? { opacity: 0, x: 20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${variantStyle.accent} mb-2 mx-auto`}>
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-800">{stats.avgRating}</div>
                  <div className="text-xs text-neutral-600">{t.averageRating}</div>
                </div>
                <div className="text-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${variantStyle.accent} mb-2 mx-auto`}>
                    <Users className="h-6 w-6 text-neutral-600" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-800">{stats.totalReviews}</div>
                  <div className="text-xs text-neutral-600">{t.totalReviews}</div>
                </div>
                <div className="text-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${variantStyle.accent} mb-2 mx-auto`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-800">{stats.satisfactionRate}%</div>
                  <div className="text-xs text-neutral-600">{t.satisfactionRate}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filters and Controls */}
   

      

      {/* Results Info */}
      <motion.div
        className="text-sm text-neutral-600"
        initial={animated ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {t.showingResults
          .replace('{count}', Math.min(displayedItems, processedTestimonials.length))
          .replace('{total}', processedTestimonials.length)}
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
        initial={animated ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <AnimatePresence>
          {processedTestimonials
            .slice(0, displayedItems)
            .map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                initial={animated ? { opacity: 0, y: 30, scale: 0.9 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  variant={variant}
                  animated={animated}
                  glowEffect={true}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {displayedItems < processedTestimonials.length && (
        <motion.div
          className="text-center"
          initial={animated ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setDisplayedItems(prev => prev + itemsPerPage)}
            className={`
              px-8 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r ${variantStyle.accent}
              hover:shadow-lg transform hover:scale-105
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t.loadMore}
          </motion.button>
        </motion.div>
      )}

      {/* Bottom Accent Line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
        initial={animated ? { scaleX: 0 } : {}}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      />
    </motion.div>
  );
};