'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import WelcomeStories from './WelcomeStories';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/galeria': 'Galeria',
  '/mensagens': 'Mensagens',
};

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    // Prevent scroll during animation
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      document.body.style.overflow = '';
    }, 350);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (pathname === '/login') {
    return <div key={pathname} className="animate-page-in">{children}</div>;
  }

  return (
    <div key={pathname}>
      <Header title={PAGE_TITLES[pathname] ?? 'SweetSpot'} />
      <Navigation />
      <div className="animate-page-in">
        {children}
      </div>
      <WelcomeStories />
    </div>
  );
}
