import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from './LanguageContext'
import { useTheme } from './ThemeContext'

const PreferencesContext = createContext(null)
const STORAGE_KEY = 'dashboard_preferences'

const DEFAULT_PREFERENCES = {
  compactSidebar: false,
  largeText: false,
  animationsEnabled: true,
  highContrast: false,
  autoNightMode: false,
  autoLanguage: true,
}

const getStoredPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES
  } catch {
    return DEFAULT_PREFERENCES
  }
}

const isNightHour = () => {
  const hour = new Date().getHours()
  return hour >= 19 || hour < 7
}

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(getStoredPreferences)
  const { setTheme } = useTheme()
  const { setLanguage } = useLanguage()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))

    const root = document.documentElement
    root.dataset.compactSidebar = String(preferences.compactSidebar)
    root.dataset.textSize = preferences.largeText ? 'large' : ''
    root.dataset.motion = preferences.animationsEnabled ? '' : 'reduced'
    root.dataset.contrast = preferences.highContrast ? 'high' : ''
  }, [preferences])

  useEffect(() => {
    if (preferences.autoNightMode) {
      setTheme(isNightHour() ? 'dark' : 'light')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.autoNightMode])

  useEffect(() => {
    if (preferences.autoLanguage) {
      setLanguage(navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'uz')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.autoLanguage])

  const setPreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  const value = useMemo(
    () => ({ preferences, setPreference }),
    [preferences]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider')
  }

  return context
}
