'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Navigation from './Navigation';
import WelcomeStories from './WelcomeStories';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/galeria': 'Galeria',
  '/mensagens': 'Mensagens',
  '/quer-saber': 'Quer saber?',
};

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
