// context/LanguageContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const LanguageContext = createContext({
  language: 'sw',
  setLanguage: () => {}
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('sw')

  useEffect(() => {
    // Initialize language from cookie on client side
    const savedLang = Cookies.get('lang') || 'sw'
    setLanguage(savedLang)
  }, [])

  const updateLanguage = (lang) => {
    Cookies.set('lang', lang, { expires: 365, path: '/' })
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}