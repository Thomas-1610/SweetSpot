import React from 'react';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export default function Header({ title, showProfile = true }: HeaderProps) {
  return (
    <header className="md:hidden fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md">
      <div className="h-16 flex items-center justify-between px-6 border-b-[3px] border-on-surface">
        <h1 className="font-headline-sm uppercase tracking-tighter">{title}</h1>
        {showProfile && (
          <div className="w-8 h-8 bg-primary flex items-center justify-center retro-border" style={{ borderRadius: '0' }}>
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        )}
      </div>
    </header>
  );
}