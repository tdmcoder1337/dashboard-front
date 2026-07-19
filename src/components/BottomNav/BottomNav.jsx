import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartLine, FaBox, FaUsers, FaEnvelope, FaCog } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './BottomNav.css';

const navItems = [
  { id: 1, icon: FaChartLine, titleKey: 'nav.dashboard', path: '/dashboard' },
  { id: 2, icon: FaBox, titleKey: 'nav.products', path: '/products' },
  { id: 3, icon: FaUsers, titleKey: 'nav.users', path: '/users' },
  { id: 4, icon: FaEnvelope, titleKey: 'nav.messages', path: '/messages' },
  { id: 5, icon: FaCog, titleKey: 'nav.settings', path: '/settings' },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon />
            <span>{t(item.titleKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
