import { Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import './DashboardHeader.css'

function DashboardHeader() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Dashboard</h1>
        <p className="header-subtitle">Xush kelibsiz! Bu yerda sizning statistikalar joylashtiriliadi</p>
      </div>
      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <span className="auth-user">{user.username}</span>
            <button className="btn btn-primary" type="button" onClick={logout}>
              Chiqish
            </button>
          </>
        ) : (
          <div className="auth-links" aria-label="Authentication links">
            <Link className="btn btn-primary" to="/auth/login">
              Kirish
            </Link>
            <Link className="btn btn-secondary" to="/auth/register">
              Ro'yxatdan o'tish
            </Link>
          </div>
        )}
        <Link className="btn btn-secondary" to="/settings">
          Sozlamalar
        </Link>
      </div>
    </header>
  )
}

export default DashboardHeader
