import React from 'react'
import './DashboardFooter.css'

function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Haqida</h4>
          <p>Dashboard 2026 © Barcha huquqlar himoyalangan</p>
        </div>
        <div className="footer-section">
          <h4>Havolalar</h4>
          <ul>
            <li><a href="#/">Bosh sahifa</a></li>
            <li><a href="#/docs">Hujjatlar</a></li>
            <li><a href="#/support">Qo'llab-quvvatlash</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Ijtimoiy tarmoqlar</h4>
          <div className="social-links">
            <a href="#/" className="social-link">Twitter</a>
            <a href="#/" className="social-link">LinkedIn</a>
            <a href="#/" className="social-link">GitHub</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Dashboard. Barcha huquqlar saqlanib qoldi.</p>
      </div>
    </footer>
  )
}

export default DashboardFooter
