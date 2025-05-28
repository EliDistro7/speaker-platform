// components/LanguageSwitcher.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/language'

export function LanguageSwitcher({ 
  variant = 'button', // 'button', 'toggle', 'dropdown'
  size = 'md', // 'sm', 'md', 'lg'
  showIcon = true,
  className = '' 
}) {
  const { language, toggleLanguage, setLanguage, isEnglish, isSwahili } = useLanguage()

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  // Simple toggle button
  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className={`
          inline-flex items-center space-x-2 ${sizeClasses[size]} 
          bg-white/90 backdrop-blur-sm border border-neutral-200/60 
          rounded-lg font-medium text-neutral-700 hover:text-neutral-900 
          hover:bg-white hover:border-neutral-300 transition-all duration-200 
          shadow-sm hover:shadow-md ${className}
        `}
        title={`Switch to ${isEnglish ? 'Swahili' : 'English'}`}
      >
        {showIcon && <Globe className={iconSizes[size]} />}
        <span className="font-semibold">
          {isEnglish ? 'EN' : 'SW'}
        </span>
      </motion.button>
    )
  }

  // Toggle switch style
  if (variant === 'toggle') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showIcon && <Languages className={iconSizes[size]} />}
        <div className="relative">
          <motion.button
            onClick={toggleLanguage}
            className="relative w-14 h-7 bg-neutral-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            style={{ backgroundColor: isEnglish ? '#6366f1' : '#d1d5db' }}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{ x: isEnglish ? 32 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <div className="flex justify-between mt-1 text-xs font-medium text-neutral-600">
            <span className={isSwahili ? 'text-indigo-600' : ''}>SW</span>
            <span className={isEnglish ? 'text-indigo-600' : ''}>EN</span>
          </div>
        </div>
      </div>
    )
  }

  // Dropdown style
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`
            ${sizeClasses[size]} bg-white/90 backdrop-blur-sm border 
            border-neutral-200/60 rounded-lg font-medium text-neutral-700 
            hover:border-neutral-300 focus:outline-none focus:ring-2 
            focus:ring-indigo-500 focus:border-indigo-500 transition-all 
            duration-200 shadow-sm hover:shadow-md appearance-none pr-8
          `}
        >
          <option value="sw">Kiswahili</option>
          <option value="en">English</option>
        </select>
        {showIcon && (
          <Globe className={`${iconSizes[size]} absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-neutral-500`} />
        )}
      </div>
    )
  }

  return null
}

// Utility hook for language-specific content
export function useTranslation(translations) {
  const { language } = useLanguage()
  return translations[language] || translations['sw'] || {}
}

// Higher-order component for conditional rendering based on language
export function LanguageGuard({ language: targetLang, children, fallback = null }) {
  const { language } = useLanguage()
  return language === targetLang ? children : fallback
}