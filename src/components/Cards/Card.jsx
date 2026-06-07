import React from 'react';
import './Card.css';

const Card = ({ children, className, style, onClick, data }) => {
  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(data);
    }
  };

  const handleClick = () => {
    if (onClick) onClick(data);
  };

  return (
    <div
      className={`card ${className || ''}`}
      style={style}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

export default Card;
