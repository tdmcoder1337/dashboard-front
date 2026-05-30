import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sidebarData } from './SidebarData';
import './Sidebar.css';

function Siderbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
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
    </div>
  );
}

export default Siderbar;








