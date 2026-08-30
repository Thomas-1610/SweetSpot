'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/galeria', label: 'Galeria', icon: 'photo_library' },
    { path: '/mensagens', label: 'Mensagens', icon: 'auto_stories' },
  ];
  
  return (
    <>
      {/* Desktop Navigation - Top Horizontal */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-surface border-b-[3px] border-on-surface">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">favorite</span>
            <span className="font-headline-sm uppercase tracking-tighter">SweetSpot</span>
          </div>
          
          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-label-lg px-4 py-2 retro-border active-press transition-colors ${
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
          
          <div className="w-8 h-8 bg-primary flex items-center justify-center retro-border">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Vertical */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface border-t-[3px] border-on-surface">
        <div className="flex h-16 justify-around items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors active-press ${
                  isActive 
                    ? 'bg-secondary-container text-on-surface' 
                    : 'text-on-surface border-l-[3px] border-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-sm uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}