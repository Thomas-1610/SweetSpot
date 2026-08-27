import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function PixelButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: PixelButtonProps) {
  const baseStyles = 'retro-border retro-shadow active-press font-label-lg uppercase tracking-widest transition-transform';
  
  const variantStyles = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    outline: 'bg-surface text-on-surface',
  };
  
  const sizeStyles = {
    sm: 'h-10 px-4 text-xs',
    md: 'h-12 px-6 text-sm',
    lg: 'h-16 px-8 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{ borderRadius: '0' }}
      {...props}
    >
      {children}
    </button>
  );
}