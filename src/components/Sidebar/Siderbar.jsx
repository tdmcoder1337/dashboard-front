import { useNavigate, useLocation } from 'react-router-dom';
import { FaBriefcase, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AccountAvatar from '../AccountAvatar/AccountAvatar';
import { sidebarData } from './SidebarData';
import './Sidebar.css';

function Siderbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const accountName = user?.name || user?.username || 'Admin';

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <FaBriefcase />
        </span>
        <strong>Market Admin</strong>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {sidebarData.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleItemClick(item.path)}
          >
            <item.icon />
            <span className="sidebar-item-text">{item.title}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-account" type="button" onClick={() => handleItemClick('/settings')}>
        <AccountAvatar className="sidebar-account-avatar" src={user?.avatar} name={accountName} />
        <span className="sidebar-account-info">
          <strong>{accountName}</strong>
          <small>{user?.email || 'admin@gmail.com'}</small>
        </span>
        <FaChevronDown className="sidebar-account-chevron" />
      </button>
    </div>
  );
}

export default Siderbar;








