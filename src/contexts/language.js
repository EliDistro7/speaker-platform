// context/LanguageContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie';

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'sw',
  setLanguage: () => {}
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('sw')

  useEffect(() => {
    // Initialize language from cookie on client side
    const savedLang = Cookies.get('lang') || 'sw'
    setLanguage(savedLang)
  }, [])

  const updateLanguage = (lang: string) => {
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