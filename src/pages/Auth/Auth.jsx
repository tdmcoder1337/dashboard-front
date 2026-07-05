import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaLock, FaUser } from 'react-icons/fa'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './Auth.css'

function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { t } = useLanguage()
  const initialMode = location.pathname.includes('register') ? 'register' : 'login'
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const content = useMemo(
    () =>
      mode === 'login'
        ? {
            title: t('auth.loginTitle'),
            subtitle: t('auth.loginSubtitle'),
            submit: t('auth.loginSubmit'),
            switchText: t('auth.noAccount'),
            switchAction: t('auth.registerSubmit'),
          }
        : {
            title: t('auth.registerTitle'),
            subtitle: t('auth.registerSubtitle'),
            submit: t('auth.registerSubmit'),
            switchText: t('auth.haveAccount'),
            switchAction: t('auth.loginSubmit'),
          },
    [mode, t]
  )

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    navigate(`/auth/${nextMode}`, { replace: true })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login(form)
      } else {
        await register(form)
      }

      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || t('auth.serverError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-shell">
        <div className="auth-panel">
          <div className="auth-heading">
            <span className="auth-kicker">{t('auth.kicker')}</span>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>

          <div className="auth-top-actions">
            <LanguageSwitcher />
          </div>

          <div className="auth-toggle" aria-label="Auth mode">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('login')}
            >
              {t('auth.loginSubmit')}
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('register')}
            >
              {t('auth.registerSubmit')}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>{t('auth.usernameLabel')}</span>
              <div>
                <FaUser />
                <input
                  autoComplete="username"
                  minLength="3"
                  name="username"
                  onChange={handleChange}
                  placeholder="username"
                  required
                  type="text"
                  value={form.username}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>{t('auth.passwordLabel')}</span>
              <div>
                <FaLock />
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength="6"
                  name="password"
                  onChange={handleChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  type="password"
                  value={form.password}
                />
              </div>
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? t('auth.submitting') : content.submit}
            </button>
          </form>

          <p className="auth-switch">
            {content.switchText}{' '}
            <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>
              {content.switchAction}
            </button>
          </p>

          <Link className="auth-back" to="/dashboard">
            {t('auth.backToDashboard')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Auth
