import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Globe, Award, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const ProfileBanner = ({ speaker, language = 'en' }) => {
  const translations = {
    en: {
      transformingLeaders: 'Transforming Leaders',
      worldwide: 'Worldwide',
      experienceExcellence: 'Experience Excellence in Leadership',
      bookNow: 'Book Speaking Engagement',
      totalSpeaks: 'Speaking Events',
      yearsExperience: 'Years Experience',
      clientsSatisfied: 'Clients Satisfied',
      countriesReached: 'Countries Reached'
    },
    sw: {
      transformingLeaders: 'Kubadilisha Viongozi',
      worldwide: 'Ulimwenguni',
      experienceExcellence: 'Pata Ubora katika Uongozi',
      bookNow: 'Weka Mazungumzo',
      totalSpeaks: 'Matukio ya Mazungumzo',
      yearsExperience: 'Miaka ya Uzoefu',
      clientsSatisfied: 'Wateja Waliordhishwa',
      countriesReached: 'Nchi Zilizofikwa'
    }
  };

  const t = translations[language];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const stats = [
    { icon: Users, value: speaker?.totalSpeaks || 247, label: t.totalSpeaks },
    { icon: Award, value: '15+', label: t.yearsExperience },
    { icon: Star, value: '500+', label: t.clientsSatisfied },
    { icon: Globe, value: '25+', label: t.countriesReached }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <motion.div
        className="relative z-10 px-6 py-16 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div variants={itemVariants} className="text-white space-y-8">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span className="text-sm font-semibold text-cyan-100">
                  {t.transformingLeaders} • {t.worldwide}
                </span>
              </motion.div>

              {/* Main heading */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  variants={itemVariants}
                >
                  <span className="block text-white">Dr. James</span>
                  <span className="block bg-gradient-to-r from-cyan-300 via-cyan-200 to-white bg-clip-text text-transparent">
                    Mwangamba
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl lg:text-2xl text-blue-100 font-medium"
                  variants={itemVariants}
                >
                  {speaker?.title || (language === 'en' 
                    ? "Business & Life Coach, International Speaker & Entrepreneur"
                    : "Kocha wa Biashara na Maisha, Mzungumzaji wa Kimataifa na Mfanyabiashara"
                  )}
                </motion.p>
              </div>

              {/* Description */}
              <motion.p 
                className="text-lg text-blue-200 leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                {t.experienceExcellence}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                className="group bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <span>{t.bookNow}</span>
                <motion.div
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* Stats Row */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                variants={itemVariants}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <stat.icon className="w-6 h-6 text-cyan-300" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative">
                {/* Main image container */}
                <motion.div
                  className="relative z-10"
                  variants={floatingVariants}
                  
                >
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 p-4">
                 {/* Image holder with banner.jpg */}
<div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden">
  <Image 
    src="/af.jpeg" 
    alt="Speaker Photo" 
    fill
    className="object-cover rounded-2xl"
  />
</div>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-cyan-600/30 rounded-full blur-xl z-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl p-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />

                {/* Rating badge */}
                <motion.div
                  className="absolute top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 z-20"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 text-yellow-400 fill-current" 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {speaker?.rating || 4.9}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    500+ Reviews
                  </p>
                </motion.div>

                {/* Achievement badge */}
                <motion.div
                  className="absolute bottom-6 -right-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-xl z-20"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <Award className="w-6 h-6 mb-2 mx-auto" />
                  <p className="text-xs font-semibold text-center">
                    Top Speaker
                  </p>
                  <p className="text-xs opacity-90 text-center">
                    2024
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default ProfileBanner;