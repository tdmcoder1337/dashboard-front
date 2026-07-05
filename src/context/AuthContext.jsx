import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, usersApi } from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'dashboard_user'
const ACCOUNTS_KEY = 'dashboard_accounts'

const stripAt = (value = '') => String(value).replace(/^@/, '')

const normalizeUser = (user) => (user ? { ...user, username: stripAt(user.username) } : null)

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

const getStoredUser = () => normalizeUser(readJson(STORAGE_KEY, null))

const getStoredAccounts = () => {
  const accounts = readJson(ACCOUNTS_KEY, [])
  return Array.isArray(accounts) ? accounts.filter(Boolean).map(normalizeUser) : []
}

const upsertAccount = (accounts, account) => {
  const exists = accounts.some((item) => item.id === account.id)
  return exists ? accounts.map((item) => (item.id === account.id ? account : item)) : [...accounts, account]
}

const HEARTBEAT_INTERVAL_MS = 45 * 1000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [accounts, setAccounts] = useState(getStoredAccounts)

  useEffect(() => {
    if (!user?.id) return undefined

    const sendHeartbeat = () => {
      usersApi.heartbeat(user.id).catch(() => {})
    }

    sendHeartbeat()
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [user?.id])

  const persistAccounts = (nextAccounts) => {
    setAccounts(nextAccounts)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))
  }

  const saveUser = (rawUser) => {
    const nextUser = normalizeUser(rawUser)
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    persistAccounts(upsertAccount(getStoredAccounts(), nextUser))
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

  const switchAccount = (accountId) => {
    const account = accounts.find((item) => item.id === accountId)

    if (!account) return

    setUser(account)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
  }

  const removeAccount = (accountId) => {
    persistAccounts(accounts.filter((item) => item.id !== accountId))

    if (user?.id === accountId) {
      logout()
    }
  }

  const updateProfile = async (payload) => {
    if (!user?.id) throw new Error('Not authenticated')

    const { data } = await usersApi.update(user.id, payload)
    const nextUser = { ...user, ...normalizeUser(data) }
    saveUser(nextUser)
    return nextUser
  }

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user?.id) throw new Error('Not authenticated')

    await usersApi.update(user.id, { currentPassword, newPassword })
  }

  const value = useMemo(
    () => ({
      user,
      accounts,
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      switchAccount,
      removeAccount,
      updateProfile,
      changePassword,
    }),
    [user, accounts]
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
