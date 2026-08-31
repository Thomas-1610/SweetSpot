'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Navigation from './Navigation';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/galeria': 'Galeria',
  '/mensagens': 'Mensagens',
};

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      <Header title={PAGE_TITLES[pathname] ?? 'SweetSpot'} />
      <Navigation />
      {children}
    </>
  );
}
