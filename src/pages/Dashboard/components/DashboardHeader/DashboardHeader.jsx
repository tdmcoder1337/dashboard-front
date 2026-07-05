import { Link } from 'react-router-dom'
import LanguageSwitcher from '../../../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../../../context/AuthContext'
import { useLanguage } from '../../../../context/LanguageContext'
import './DashboardHeader.css'

function DashboardHeader() {
  const { isAuthenticated, logout, user } = useAuth()
  const { t } = useLanguage()

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>{t('nav.dashboard')}</h1>
        <p className="header-subtitle">{t('dashboard.subtitle')}</p>
      </div>
      <div className="header-actions">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <>
            <span className="auth-user">{user.username}</span>
            <button className="btn btn-primary" type="button" onClick={logout}>
              {t('dashboard.logout')}
            </button>
          </>
        ) : (
          <div className="auth-links" aria-label="Authentication links">
            <Link className="btn btn-primary" to="/auth/login">
              {t('dashboard.login')}
            </Link>
            <Link className="btn btn-secondary" to="/auth/register">
              {t('dashboard.register')}
            </Link>
          </div>
        )}
        <Link className="btn btn-secondary" to="/settings">
          {t('dashboard.settings')}
        </Link>
      </div>
    </header>
  )
}

export default DashboardHeader
