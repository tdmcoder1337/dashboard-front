import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaCamera,
  FaCheck,
  FaLock,
  FaMoon,
  FaPalette,
  FaPlus,
  FaSignOutAlt,
  FaSun,
  FaTrashAlt,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import AccountAvatar from '../../components/AccountAvatar/AccountAvatar'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
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
})

function Settings() {
  const navigate = useNavigate()
  const { user, accounts, isAuthenticated, logout, switchAccount, removeAccount, updateProfile, changePassword } =
    useAuth()
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

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
  const fileInputRef = useRef(null)

  useEffect(() => {
    setProfileForm(buildProfileForm(user))
    setProfileStatus(null)

  }, [user?.id])

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
      })
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
            <form className="settings-card" onSubmit={handleProfileSubmit}>
              <div className="settings-card-heading">
                <h2>{t('settings.profileHeading')}</h2>
                <p>{t('settings.profileSubheading')}</p>
              </div>

              <div className="settings-avatar-row">
                <AccountAvatar src={profileForm.avatar} name={profileForm.name || profileForm.username} size={72} />
                <div className="settings-avatar-actions">
                  <button
                    type="button"
                    className="settings-btn settings-btn-ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera /> {t('settings.uploadAvatar')}
                  </button>
                  {profileForm.avatar ? (
                    <button
                      type="button"
                      className="settings-btn settings-btn-danger-ghost"
                      onClick={() => setProfileForm((current) => ({ ...current, avatar: '' }))}
                    >
                      <FaTrashAlt /> {t('settings.removeAvatar')}
                    </button>
                  ) : null}
                  <small>{t('settings.avatarHint')}</small>
                </div>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={handleAvatarSelect}
                />
              </div>

              <div className="settings-grid">
                <label className="settings-field">
                  <span>{t('settings.name')}</span>
                  <input
                    name="name"
                    placeholder={t('settings.namePlaceholder')}
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="settings-field">
                  <span>{t('settings.usernameLabel')}</span>
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

                <label className="settings-field settings-field-wide">
                  <span>{t('settings.email')}</span>
                  <input
                    name="email"
                    placeholder="email@example.com"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="settings-field settings-field-wide">
                  <span>{t('settings.bio')}</span>
                  <textarea
                    maxLength={BIO_MAX_LENGTH}
                    name="bio"
                    placeholder={t('settings.bioPlaceholder')}
                    rows="4"
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

              <div className="settings-card-footer">
                <button className="settings-btn settings-btn-primary" disabled={isSavingProfile} type="submit">
                  {isSavingProfile ? t('settings.saving') : t('settings.save')}
                </button>
              </div>
            </form>
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Settings
