'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserProfile from './UserProfile';
import { getCurrentUser } from '@/lib/auth';

export default function Navigation() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/galeria', label: 'Galeria', icon: 'photo_library' },
    { path: '/mensagens', label: 'Mensagens', icon: 'auto_stories' },
  ];
  
  return (
    <>
      {/* Desktop Navigation - Top Horizontal */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-surface border-b-[3px] border-on-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[24px]">favorite</span>
            <span className="font-headline-sm uppercase tracking-tighter hidden sm:block">SweetSpot</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-label-sm md:font-label-lg px-2 md:px-4 py-2 retro-border active-press transition-colors text-xs md:text-sm ${
                    isActive 
                      ? 'bg-secondary-container text-on-surface' 
                      : 'bg-surface text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {currentUser ? (
            <div className="flex-shrink-0">
              <UserProfile />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary flex items-center justify-center retro-border flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Vertical */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface border-t-[3px] border-on-surface">
        <div className="flex h-16 justify-around items-stretch max-w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors active-press min-w-0 ${
                  isActive 
                    ? 'bg-secondary-container text-on-surface' 
                    : 'text-on-surface border-l-[3px] border-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-label-sm uppercase text-[10px] leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}