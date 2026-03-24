import React from 'react';

const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-all duration-200';
  
  const variants = {
    default: 'bg-white/5 text-white border-white/10',
    applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    interview: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    offer: 'bg-green-500/10 text-green-400 border-green-500/20',
    selected: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span 
      className={`${baseStyles} ${variants[variant.toLowerCase()] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
