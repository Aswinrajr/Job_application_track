import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  const baseStyles = 'bg-app-card border border-app-border rounded-xl p-5 shadow-premium overflow-hidden';
  const hoverStyles = hoverEffect ? 'card-hover cursor-pointer border-white/10 hover:border-accent/40 bg-white/[0.03] hover:bg-white/[0.05]' : '';

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
