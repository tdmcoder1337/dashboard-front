import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'dashboard_language'

const getStoredLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'ru' || stored === 'uz' ? stored : 'uz'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage)

  const setLanguage = useCallback((next) => {
    const value = next === 'ru' ? 'ru' : 'uz'
    setLanguageState(value)
    localStorage.setItem(STORAGE_KEY, value)
  }, [])

  const t = useCallback(
    (key, params) => {
      const template = translations[language][key] ?? translations.uz[key] ?? key
      if (!params) return template

      return template.replace(/\{(\w+)\}/g, (match, name) =>
        params[name] !== undefined ? String(params[name]) : match
      )
    },
    [language]
  )

  const value = useMemo(
    () => ({
      language,
      locale: language === 'ru' ? 'ru-RU' : 'en-GB',
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
