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
  const baseStyles = 'retro-border retro-shadow active-press font-label-lg uppercase tracking-widest transition-transform flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    outline: 'bg-surface text-on-surface',
  };
  
  const sizeStyles = {
    sm: 'h-10 px-2 md:px-4 text-[10px] md:text-xs',
    md: 'h-12 px-3 md:px-6 text-xs md:text-sm',
    lg: 'h-16 px-4 md:px-8 text-sm md:text-base',
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