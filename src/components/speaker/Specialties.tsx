import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language';
import { Star, Sparkles, Award } from 'lucide-react';

const translations = {
  en: {
    specialties: 'Specialties',
    expertise: 'Areas of Expertise',
    noSpecialties: 'No specialties listed'
  },
  sw: {
    specialties: 'Utaalamu',
    expertise: 'Maeneo ya Utaalamu',
    noSpecialties: 'Hakuna utaalamu ulioainishwa'
  }
};

export const SpecialtiesList = ({ specialties }) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (!specialties || specialties.length === 0) {
    return null;
  }

  const getRandomGradient = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-green-500 to-emerald-600'
    ];
    return gradients[index % gradients.length];
  };

  const getRandomIcon = (index) => {
    const icons = [Star, Sparkles, Award];
    const IconComponent = icons[index % icons.length];
    return IconComponent;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8"
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center space-x-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
            {t.specialties}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">{t.expertise}</p>
          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mt-2"></div>
        </div>
      </motion.div>

      {/* Specialties Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence>
          {specialties.map((specialty, index) => {
            const IconComponent = getRandomIcon(index);
            const gradient = getRandomGradient(index);
            
            return (
              <motion.div
                key={specialty}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Main Badge */}
                <div className="relative bg-gradient-to-br from-white via-neutral-50/50 to-indigo-50/30 rounded-xl p-4 shadow-sm border border-neutral-200/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
                    <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${gradient} rounded-full transform -translate-x-6 translate-y-6`}></div>
                  </div>

                  <div className="relative flex items-center space-x-3">
                    {/* Icon */}
                    <motion.div 
                      className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} shadow-sm group-hover:shadow-md transition-all duration-300`}
                      whileHover={{ rotate: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-neutral-800 group-hover:text-indigo-700 transition-colors duration-300 truncate">
                        {specialty}
                      </span>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 rounded-xl blur-xl -z-10`}
                    whileHover={{ opacity: 0.1, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20"
                    initial={false}
                    whileHover={{
                      background: [
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
                      ],
                      x: ['-100%', '100%']
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>

                {/* Floating particles effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${gradient} rounded-full`}
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="mt-6 flex items-center justify-center space-x-4 text-sm text-neutral-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
          <span>{specialties.length} {specialties.length === 1 ? 'Specialty' : 'Specialties'}</span>
        </div>
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-6 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      />
    </motion.div>
  );
};