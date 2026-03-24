import React from 'react';
import { IoSearch } from 'react-icons/io5';

const Input = ({ label, error, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-app-muted ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-app-dark border border-app-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-app-muted/60 transition-all duration-200 outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500/80 ml-0.5 animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};

const SearchInput = ({ className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-app-muted">
        <IoSearch size={18} />
      </div>
      <input
        type="search"
        className="w-full bg-app-dark border border-app-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-app-muted/60 transition-all duration-200 outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
        {...props}
      />
    </div>
  );
};

export { Input, SearchInput };
