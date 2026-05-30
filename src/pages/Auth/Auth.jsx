import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaLock, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const initialMode = location.pathname.includes('register') ? 'register' : 'login'
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const content = useMemo(
    () =>
      mode === 'login'
        ? {
            title: 'Kirish',
            subtitle: 'Dashboard akkauntingizga xavfsiz kiring.',
            submit: 'Kirish',
            switchText: "Akkauntingiz yo'qmi?",
            switchAction: "Ro'yxatdan o'tish",
          }
        : {
            title: "Ro'yxatdan o'tish",
            subtitle: 'Yangi dashboard profilini bir necha soniyada yarating.',
            submit: "Ro'yxatdan o'tish",
            switchText: 'Akkauntingiz bormi?',
            switchAction: 'Kirish',
          },
    [mode]
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
      setError(requestError.response?.data?.message || 'Server bilan ulanishda xatolik yuz berdi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-shell">
        <div className="auth-panel">
          <div className="auth-heading">
            <span className="auth-kicker">Dashboard Auth</span>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>

          <div className="auth-toggle" aria-label="Auth mode">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('login')}
            >
              Kirish
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('register')}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Username</span>
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
              <span>Password</span>
              <div>
                <FaLock />
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength="6"
                  name="password"
                  onChange={handleChange}
                  placeholder="kamida 6 belgi"
                  required
                  type="password"
                  value={form.password}
                />
              </div>
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Yuborilmoqda...' : content.submit}
            </button>
          </form>

          <p className="auth-switch">
            {content.switchText}{' '}
            <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>
              {content.switchAction}
            </button>
          </p>

          <Link className="auth-back" to="/dashboard">
            Dashboardga qaytish
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Auth
