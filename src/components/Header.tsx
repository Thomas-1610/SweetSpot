'use client';

import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { getCurrentUser, User } from '@/lib/auth';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export default function Header({ title, showProfile = true }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
  }, []);

  if (!mounted) {
    return (
      <header className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-surface/90 backdrop-blur-md">
        <div className="h-16 flex items-center justify-between px-4 border-b-[3px] border-on-surface">
          <h1 className="font-headline-sm uppercase tracking-tighter text-sm">{title}</h1>
          <div className="w-8 h-8 bg-primary flex items-center justify-center retro-border flex-shrink-0" style={{ borderRadius: '0' }}>
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-surface/90 backdrop-blur-md">
      <div className="h-16 flex items-center justify-between px-4 border-b-[3px] border-on-surface">
        <h1 className="font-headline-sm uppercase tracking-tighter text-sm">{title}</h1>
        {showProfile && user ? (
          <UserProfile />
        ) : (
          <div className="w-8 h-8 bg-primary flex items-center justify-center retro-border flex-shrink-0" style={{ borderRadius: '0' }}>
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        )}
      </div>
    </header>
  );
}