import React from 'react';
import './Card.css';

const CardHeader = ({ title, subtitle, icon, action }) => {
  return (
    <div className="card-header">
      <div className="card-header-content">
        {icon && <span className="card-icon">{icon}</span>}
        <div>   
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="card-action">{action}</div>}
    </div>
  );
};

export default CardHeader;
