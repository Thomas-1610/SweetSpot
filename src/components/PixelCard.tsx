import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function PixelCard({ children, className = '', hover = false }: PixelCardProps) {
  const baseStyles = 'bg-surface-container-lowest retro-border retro-shadow p-4';
  const hoverStyles = hover ? 'transition-transform duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} style={{ borderRadius: '0' }}>
      {children}
    </div>
  );
}