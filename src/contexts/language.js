// context/LanguageContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const LanguageContext = createContext({
  language: 'sw',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isEnglish: false,
  isSwahili: true
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('sw')

  useEffect(() => {
    // Initialize language from cookie on client side
    const savedLang = Cookies.get('lang') || 'sw'
    setLanguage(savedLang)
  }, [])

  const updateLanguage = (lang) => {
    if (lang === 'en' || lang === 'sw') {
      Cookies.set('lang', lang, { expires: 365, path: '/' })
      setLanguage(lang)
    }
  }

  // Utility function to toggle between languages
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'sw' : 'en'
    updateLanguage(newLang)
  }

  // Utility getters for easier conditionals
  const isEnglish = language === 'en'
  const isSwahili = language === 'sw'

  const contextValue = {
    language,
    setLanguage: updateLanguage,
    toggleLanguage,
    isEnglish,
    isSwahili
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}