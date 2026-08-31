'use client';

import UserProfile from './UserProfile';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export default function Header({ title, showProfile = true }: HeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-surface/90 backdrop-blur-md">
      <div className="h-16 flex items-center justify-between px-4 border-b-[3px] border-on-surface">
        <h1 className="font-headline-sm uppercase tracking-tighter text-sm">{title}</h1>
        {showProfile ? (
          <UserProfile />
        ) : (
          <div className="w-11 h-11 flex-shrink-0" />
        )}
      </div>
    </header>
  );
}
