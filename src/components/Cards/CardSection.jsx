import React from 'react';
import './Card.css';

const CardSection = ({ children, className }) => {
  return (
    <div className={`card-section ${className || ''}`}>
      {children}
    </div>
  );
};

export default CardSection;
