import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'dashboard_user'

const getStoredUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const saveUser = (nextUser) => {
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    saveUser(data.user)
    return data
  }

  const register = async (credentials) => {
    const { data } = await authApi.register(credentials)
    saveUser(data.user)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
