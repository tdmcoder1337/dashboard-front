import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaAdjust,
  FaCalendarAlt,
  FaCamera,
  FaChevronRight,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaCompressAlt,
  FaDesktop,
  FaFont,
  FaGlobe,
  FaLock,
  FaMagic,
  FaMapMarkerAlt,
  FaMoon,
  FaPalette,
  FaPlus,
  FaRegSave,
  FaShieldAlt,
  FaSignOutAlt,
  FaSun,
  FaTrashAlt,
  FaUser,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import AccountAvatar from '../../components/AccountAvatar/AccountAvatar'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { usePreferences } from '../../context/PreferencesContext'
import { useTheme } from '../../context/ThemeContext'
import './Settings.css'

const MAX_AVATAR_SIZE = 2 * 1024 * 1024
const BIO_MAX_LENGTH = 300

const buildProfileForm = (user) => ({
  name: user?.name || '',
  username: user?.username || '',
  email: user?.email || '',
  bio: user?.bio || '',
  avatar: user?.avatar || '',
  phone: user?.phone || '',
  country: user?.country || '',
  city: user?.city || '',
  address: user?.address || '',
  postalCode: user?.postalCode || '',
})

const formatRelativeTime = (t, date) => {
  if (!date) return t('settings.lastUpdatedNever')

  const diffMs = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minutesAgo', { n: minutes })

  const hours = Math.floor(minutes / 60)
  return t('time.hoursAgo', { n: hours })
}

function Settings() {
  const navigate = useNavigate()
  const {
    user,
    accounts,
    isAuthenticated,
    logout,
    switchAccount,
    removeAccount,
    updateProfile,
    changePassword,
    deleteAccount,
  } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const { preferences, setPreference } = usePreferences()
  const [justSaved, setJustSaved] = useState(false)

  const handleConfirmSave = () => {
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }

  const SECTIONS = [
    { id: 'profile', label: t('settings.sectionProfile'), icon: <FaUserCircle /> },
    { id: 'security', label: t('settings.sectionSecurity'), icon: <FaLock /> },
    { id: 'accounts', label: t('settings.sectionAccounts'), icon: <FaUsers /> },
    { id: 'appearance', label: t('settings.sectionAppearance'), icon: <FaPalette /> },
  ]

  const [activeSection, setActiveSection] = useState('profile')
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(user))
  const [profileStatus, setProfileStatus] = useState(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const fileInputRef = useRef(null)
  const prevUserId = useRef(user?.id)

  if (prevUserId.current !== user?.id) {
    prevUserId.current = user?.id
    setProfileForm(buildProfileForm(user))
    setProfileStatus(null)
  }

  if (!isAuthenticated) {
    return (
      <section className="settings-page">
        

        <div className="settings-guest">
          <FaUserCircle />
          <h2>{t('settings.guestTitle')}</h2>
          <p>{t('settings.guestText')}</p>
          <div className="settings-guest-actions">
            <Link className="settings-btn settings-btn-primary" to="/auth/login">
              {t('settings.login')}
            </Link>
            <Link className="settings-btn settings-btn-ghost" to="/auth/register">
              {t('settings.register')}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfileForm((current) => ({ ...current, [name]: value }))
  }

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setProfileStatus({ type: 'error', text: t('settings.avatarTypeError') })
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setProfileStatus({ type: 'error', text: t('settings.avatarSizeError') })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfileForm((current) => ({ ...current, avatar: reader.result }))
      setProfileStatus(null)
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setProfileStatus(null)

    if (!profileForm.username.trim()) {
      setProfileStatus({ type: 'error', text: t('settings.usernameEmptyError') })
      return
    }

    setIsSavingProfile(true)

    try {
      await updateProfile({
        name: profileForm.name,
        username: profileForm.username,
        email: profileForm.email,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
        phone: profileForm.phone,
        country: profileForm.country,
        city: profileForm.city,
        address: profileForm.address,
        postalCode: profileForm.postalCode,
      })
      setLastSavedAt(new Date())
      setProfileStatus({ type: 'success', text: t('settings.profileSuccess') })
    } catch (requestError) {
      setProfileStatus({
        type: 'error',
        text: requestError.response?.data?.message || t('settings.profileError'),
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((current) => ({ ...current, [name]: value }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordStatus(null)

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: t('settings.passwordTooShort') })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: t('settings.passwordMismatch') })
      return
    }

    setIsSavingPassword(true)

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordStatus({ type: 'success', text: t('settings.passwordSuccess') })
    } catch (requestError) {
      setPasswordStatus({
        type: 'error',
        text: requestError.response?.data?.message === 'Current password is incorrect'
          ? t('settings.currentPasswordWrong')
          : requestError.response?.data?.message || t('settings.passwordError'),
      })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const handleToggleAccountPreference = async (key, value) => {
    try {
      await updateProfile({ [key]: value })
    } catch {
      /* preference toggles are best-effort; ignore transient failures */
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm(t('settings.deleteAccountConfirm'))) return

    setIsDeletingAccount(true)

    try {
      await deleteAccount()
      navigate('/auth/login')
    } catch (requestError) {
      setProfileStatus({
        type: 'error',
        text: requestError.response?.data?.message || t('settings.deleteAccountError'),
      })
      setIsDeletingAccount(false)
    }
  }

  return (
    <section className="settings-page">
      <header className="settings-header">
        <div>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="settings-shell">
        <nav className="settings-nav" aria-label={t('settings.sectionsAria')}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}

          <button type="button" className="settings-nav-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{t('settings.logout')}</span>
          </button>
        </nav>

        <div className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-profile-layout">
              <div className="settings-profile-side">
                <div className="settings-card settings-profile-summary">
                  <div className="settings-profile-avatar-wrap">
                    <AccountAvatar src={profileForm.avatar} name={profileForm.name || profileForm.username} size={88} />
                    <button
                      type="button"
                      className="settings-avatar-edit"
                      aria-label={t('settings.uploadAvatar')}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCamera />
                    </button>
                    <input ref={fileInputRef} accept="image/*" hidden type="file" onChange={handleAvatarSelect} />
                  </div>

                  <strong className="settings-profile-name">{profileForm.name || profileForm.username}</strong>
                  <span className="settings-profile-email">{profileForm.email}</span>
                  <span className="settings-profile-role-badge">{t(`role.${user.role}`)}</span>

                  <dl className="settings-profile-meta">
                    <div>
                      <dt><FaCalendarAlt /> {t('settings.joinedDate')}</dt>
                      <dd>
                        {user.registeredAt
                          ? new Date(user.registeredAt).toLocaleDateString()
                          : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt><FaClock /> {t('settings.lastLoginDate')}</dt>
                      <dd>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}</dd>
                    </div>
                    <div>
                      <dt><FaShieldAlt /> {t('settings.statusLabel')}</dt>
                      <dd>
                        <span className={`settings-status-pill ${user.status === 'Blocked' ? 'is-blocked' : 'is-active'}`}>
                          {t(`status.${user.status}`)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="settings-card settings-quick-actions">
                  <div className="settings-card-heading">
                    <h2>{t('settings.quickActions')}</h2>
                  </div>

                  <button type="button" className="settings-quick-action" onClick={() => setActiveSection('security')}>
                    <span className="settings-toggle-icon"><FaLock /></span>
                    <span className="settings-toggle-text"><strong>{t('settings.changePassword')}</strong></span>
                    <FaChevronRight />
                  </button>

                  <button type="button" className="settings-quick-action" disabled>
                    <span className="settings-toggle-icon"><FaShieldAlt /></span>
                    <span className="settings-toggle-text"><strong>{t('settings.manage2FA')}</strong></span>
                    <span className="settings-soon-badge">{t('settings.comingSoon')}</span>
                  </button>

                  <button type="button" className="settings-quick-action" disabled>
                    <span className="settings-toggle-icon"><FaDesktop /></span>
                    <span className="settings-toggle-text"><strong>{t('settings.manageSessions')}</strong></span>
                    <span className="settings-soon-badge">{t('settings.comingSoon')}</span>
                  </button>

                  <button
                    type="button"
                    className="settings-quick-action is-danger"
                    disabled={isDeletingAccount}
                    onClick={handleDeleteAccount}
                  >
                    <span className="settings-toggle-icon"><FaTrashAlt /></span>
                    <span className="settings-toggle-text"><strong>{t('settings.deleteAccount')}</strong></span>
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <form className="settings-profile-main" onSubmit={handleProfileSubmit}>
                <div className="settings-card">
                  <div className="settings-card-heading settings-card-heading-icon">
                    <span className="settings-toggle-icon"><FaUser /></span>
                    <h2>{t('settings.basicInfoHeading')}</h2>
                  </div>

                  <div className="settings-grid">
                    <label className="settings-field">
                      <span>{t('settings.fullName')}</span>
                      <input
                        name="name"
                        placeholder={t('settings.namePlaceholder')}
                        type="text"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                      />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.usernameField')}</span>
                      <input
                        minLength="3"
                        name="username"
                        placeholder="username"
                        required
                        type="text"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                      />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.emailField')}</span>
                      <input
                        name="email"
                        placeholder="email@example.com"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.phone')}</span>
                      <input
                        name="phone"
                        placeholder={t('settings.phonePlaceholder')}
                        type="tel"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </label>

                    <label className="settings-field settings-field-wide">
                      <span>{t('settings.bio')}</span>
                      <textarea
                        maxLength={BIO_MAX_LENGTH}
                        name="bio"
                        placeholder={t('settings.bioPlaceholder')}
                        rows="3"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                      />
                      <small>
                        {profileForm.bio.length}/{BIO_MAX_LENGTH}
                      </small>
                    </label>
                  </div>

                  {profileStatus ? (
                    <p className={`settings-status settings-status-${profileStatus.type}`}>{profileStatus.text}</p>
                  ) : null}

                  <div className="settings-card-footer settings-card-footer-split">
                    <button className="settings-btn settings-btn-primary" disabled={isSavingProfile} type="submit">
                      {isSavingProfile ? t('settings.saving') : t('settings.save')}
                    </button>
                    <span className="settings-last-updated">
                      <FaCheckCircle /> {t('settings.lastUpdated', { time: formatRelativeTime(t, lastSavedAt) })}
                    </span>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-card-heading settings-card-heading-icon">
                    <span className="settings-toggle-icon"><FaMapMarkerAlt /></span>
                    <h2>{t('settings.addressHeading')}</h2>
                  </div>

                  <div className="settings-grid">
                    <label className="settings-field">
                      <span>{t('settings.country')}</span>
                      <input name="country" type="text" value={profileForm.country} onChange={handleProfileChange} />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.city')}</span>
                      <input name="city" type="text" value={profileForm.city} onChange={handleProfileChange} />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.addressField')}</span>
                      <input name="address" type="text" value={profileForm.address} onChange={handleProfileChange} />
                    </label>

                    <label className="settings-field">
                      <span>{t('settings.postalCode')}</span>
                      <input
                        name="postalCode"
                        type="text"
                        value={profileForm.postalCode}
                        onChange={handleProfileChange}
                      />
                    </label>
                  </div>
                </div>
              </form>

              <div className="settings-card settings-profile-toggles">
                <div className="settings-card-heading settings-card-heading-icon">
                  <span className="settings-toggle-icon"><FaCog /></span>
                  <h2>{t('settings.profileSettingsHeading')}</h2>
                </div>

                <div className="settings-toggle-grid">
                  <label className="settings-toggle-item">
                    <span className="settings-toggle-icon"><FaLock /></span>
                    <span className="settings-toggle-text">
                      <strong>{t('settings.emailNotifToggle')}</strong>
                      <small>{t('settings.emailNotifToggleText')}</small>
                    </span>
                    <span
                      className={`settings-switch ${user.emailNotifications !== false ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={user.emailNotifications !== false}
                      tabIndex={0}
                      onClick={() => handleToggleAccountPreference('emailNotifications', user.emailNotifications === false)}
                      onKeyDown={(event) =>
                        event.key === 'Enter' &&
                        handleToggleAccountPreference('emailNotifications', user.emailNotifications === false)
                      }
                    >
                      <span className="settings-switch-knob" />
                    </span>
                  </label>

                  <label className="settings-toggle-item">
                    <span className="settings-toggle-icon"><FaDesktop /></span>
                    <span className="settings-toggle-text">
                      <strong>{t('settings.profileVisibleToggle')}</strong>
                      <small>{t('settings.profileVisibleToggleText')}</small>
                    </span>
                    <span
                      className={`settings-switch ${user.profileVisible !== false ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={user.profileVisible !== false}
                      tabIndex={0}
                      onClick={() => handleToggleAccountPreference('profileVisible', user.profileVisible === false)}
                      onKeyDown={(event) =>
                        event.key === 'Enter' &&
                        handleToggleAccountPreference('profileVisible', user.profileVisible === false)
                      }
                    >
                      <span className="settings-switch-knob" />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <form className="settings-card" onSubmit={handlePasswordSubmit}>
              <div className="settings-card-heading">
                <h2>{t('settings.securityHeading')}</h2>
                <p>{t('settings.securitySubheading')}</p>
              </div>

              <div className="settings-grid">
                <label className="settings-field settings-field-wide">
                  <span>{t('settings.currentPassword')}</span>
                  <input
                    autoComplete="current-password"
                    name="currentPassword"
                    placeholder={t('settings.currentPasswordPlaceholder')}
                    required
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </label>

                <label className="settings-field">
                  <span>{t('settings.newPassword')}</span>
                  <input
                    autoComplete="new-password"
                    minLength="6"
                    name="newPassword"
                    placeholder={t('settings.newPasswordPlaceholder')}
                    required
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </label>

                <label className="settings-field">
                  <span>{t('settings.confirmPassword')}</span>
                  <input
                    autoComplete="new-password"
                    minLength="6"
                    name="confirmPassword"
                    placeholder={t('settings.confirmPasswordPlaceholder')}
                    required
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </label>
              </div>

              {passwordStatus ? (
                <p className={`settings-status settings-status-${passwordStatus.type}`}>{passwordStatus.text}</p>
              ) : null}

              <div className="settings-card-footer">
                <button className="settings-btn settings-btn-primary" disabled={isSavingPassword} type="submit">
                  {isSavingPassword ? t('settings.saving') : t('settings.changePassword')}
                </button>
              </div>
            </form>
          )}

          {activeSection === 'accounts' && (
            <div className="settings-card">
              <div className="settings-card-heading">
                <h2>{t('settings.accountsHeading')}</h2>
                <p>{t('settings.accountsSubheading')}</p>
              </div>

              <ul className="settings-accounts">
                {accounts.map((account) => {
                  const isActive = account.id === user.id

                  return (
                    <li key={account.id} className={isActive ? 'active' : ''}>
                      <AccountAvatar src={account.avatar} name={account.name || account.username} size={44} />
                      <div className="settings-account-info">
                        <strong>{account.name || account.username}</strong>
                        <small>@{account.username}</small>
                      </div>
                      {isActive ? (
                        <span className="settings-account-badge">{t('settings.accountActive')}</span>
                      ) : (
                        <button
                          type="button"
                          className="settings-btn settings-btn-ghost"
                          onClick={() => switchAccount(account.id)}
                        >
                          {t('settings.accountSwitch')}
                        </button>
                      )}
                      <button
                        aria-label={t('settings.accountRemoveAria')}
                        type="button"
                        className="settings-account-remove"
                        onClick={() => removeAccount(account.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="settings-card-footer settings-card-footer-split">
                <button
                  type="button"
                  className="settings-btn settings-btn-primary"
                  onClick={() => navigate('/auth/login')}
                >
                  <FaPlus /> {t('settings.addAccount')}
                </button>
                <button type="button" className="settings-btn settings-btn-danger" onClick={handleLogout}>
                  <FaSignOutAlt /> {t('settings.logout')}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="settings-card">
              <div className="settings-card-heading">
                <h2>{t('settings.appearanceHeading')}</h2>
                <p>{t('settings.appearanceSubheading')}</p>
              </div>

              <div className="settings-group-heading">
                <strong>{t('settings.themeGroupTitle')}</strong>
                <p>{t('settings.themeGroupSubtitle')}</p>
              </div>

              <div className="settings-theme-grid">
                <button
                  type="button"
                  className={`settings-theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <span className="settings-theme-preview is-light" aria-hidden="true">
                    <span className="settings-theme-preview-icon"><FaSun /></span>
                    <span className="settings-theme-preview-sidebar">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="settings-theme-preview-main">
                      <span className="settings-theme-preview-bar" />
                      <span className="settings-theme-preview-line" />
                      <span className="settings-theme-preview-line" />
                      <span className="settings-theme-preview-line short" />
                    </span>
                  </span>
                  <span className="settings-theme-footer">
                    <span className="settings-theme-label">{t('settings.lightMode')}</span>
                    <span className={`settings-theme-check ${theme === 'light' ? 'is-checked' : ''}`} aria-hidden="true">
                      {theme === 'light' ? <FaCheck /> : null}
                    </span>
                  </span>
                  <small>{t('settings.lightModeText')}</small>
                </button>

                <button
                  type="button"
                  className={`settings-theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <span className="settings-theme-preview is-dark" aria-hidden="true">
                    <span className="settings-theme-preview-icon"><FaMoon /></span>
                    <span className="settings-theme-preview-sidebar">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="settings-theme-preview-main">
                      <span className="settings-theme-preview-bar" />
                      <span className="settings-theme-preview-line" />
                      <span className="settings-theme-preview-line" />
                      <span className="settings-theme-preview-line short" />
                    </span>
                  </span>
                  <span className="settings-theme-footer">
                    <span className="settings-theme-label">{t('settings.darkMode')}</span>
                    <span className={`settings-theme-check ${theme === 'dark' ? 'is-checked' : ''}`} aria-hidden="true">
                      {theme === 'dark' ? <FaCheck /> : null}
                    </span>
                  </span>
                  <small>{t('settings.darkModeText')}</small>
                </button>
              </div>

              <div className="settings-group-heading">
                <strong>{t('settings.additionalHeading')}</strong>
              </div>

              <div className="settings-toggle-grid">
                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaCompressAlt /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.compactSidebar')}</strong>
                    <small>{t('settings.compactSidebarText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.compactSidebar ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.compactSidebar}
                    tabIndex={0}
                    onClick={() => setPreference('compactSidebar', !preferences.compactSidebar)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('compactSidebar', !preferences.compactSidebar)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>

                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaFont /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.largeText')}</strong>
                    <small>{t('settings.largeTextText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.largeText ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.largeText}
                    tabIndex={0}
                    onClick={() => setPreference('largeText', !preferences.largeText)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('largeText', !preferences.largeText)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>

                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaMagic /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.animations')}</strong>
                    <small>{t('settings.animationsText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.animationsEnabled ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.animationsEnabled}
                    tabIndex={0}
                    onClick={() => setPreference('animationsEnabled', !preferences.animationsEnabled)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('animationsEnabled', !preferences.animationsEnabled)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>

                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaAdjust /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.highContrast')}</strong>
                    <small>{t('settings.highContrastText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.highContrast ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.highContrast}
                    tabIndex={0}
                    onClick={() => setPreference('highContrast', !preferences.highContrast)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('highContrast', !preferences.highContrast)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>

                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaMoon /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.autoNightMode')}</strong>
                    <small>{t('settings.autoNightModeText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.autoNightMode ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.autoNightMode}
                    tabIndex={0}
                    onClick={() => setPreference('autoNightMode', !preferences.autoNightMode)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('autoNightMode', !preferences.autoNightMode)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>

                <label className="settings-toggle-item">
                  <span className="settings-toggle-icon"><FaGlobe /></span>
                  <span className="settings-toggle-text">
                    <strong>{t('settings.autoLanguage')}</strong>
                    <small>{t('settings.autoLanguageText')}</small>
                  </span>
                  <span
                    className={`settings-switch ${preferences.autoLanguage ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={preferences.autoLanguage}
                    tabIndex={0}
                    onClick={() => setPreference('autoLanguage', !preferences.autoLanguage)}
                    onKeyDown={(event) =>
                      event.key === 'Enter' && setPreference('autoLanguage', !preferences.autoLanguage)
                    }
                  >
                    <span className="settings-switch-knob" />
                  </span>
                </label>
              </div>

              <div className="settings-autosave-bar">
                <span className="settings-autosave-status">
                  <FaCheckCircle />
                  <span>
                    <strong>{t('settings.autosavedTitle')}</strong>
                    <small>{justSaved ? t('settings.autosavedText') : t('settings.appearanceSubheading')}</small>
                  </span>
                </span>
                <button type="button" className="settings-btn settings-btn-primary" onClick={handleConfirmSave}>
                  <FaRegSave /> {t('settings.saveConfirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Settings
