'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';
import Link from 'next/link';
import MusicaDoDia from '@/components/MusicaDoDia';
import UserProfile from '@/components/UserProfile';
import { getCurrentUser, User } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header title="Home" />
      <Navigation />
      
      <main className="md:pt-20 pt-16 min-h-screen bg-surface overflow-x-hidden">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 gap-4 md:gap-8 pb-[80px] md:pb-12">
          {/* User Profile - Desktop */}
          <div className="hidden md:flex justify-end mb-4">
            <UserProfile />
          </div>
          {/* Welcome Section */}
          <div className="flex flex-col items-center justify-center py-8 md:py-16">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-container flex items-center justify-center retro-border retro-shadow active-press transition-transform mb-4 md:mb-6">
              <span className="material-symbols-outlined text-on-primary-container text-[40px] md:text-[56px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                favorite
              </span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-background uppercase tracking-tighter text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
              Oi {currentUser.username}
            </h2>
            <p className="font-body-md md:font-body-lg text-on-surface-variant text-center mt-2 md:mt-4 max-w-2xl" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Fiz isso pra colocarmos alguns momentos .w.
            </p>
          </div>

          {/* Main Actions */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto">
            <Link href="/galeria" className="flex-1">
              <PixelButton 
                variant="primary" 
                size="lg"
                className="flex items-center justify-center gap-2 w-full h-16 md:h-20"
              >
                <span className="material-symbols-outlined">photo_library</span>
                <span>Nossas Fotos</span>
              </PixelButton>
            </Link>
            
            <Link href="/mensagens" className="flex-1">
              <PixelButton 
                variant="secondary" 
                size="lg"
                className="flex items-center justify-center gap-2 w-full h-16 md:h-20"
              >
                <span className="material-symbols-outlined">auto_stories</span>
                <span>Nossos Momentos</span>
              </PixelButton>
            </Link>
          </div>

          {/* Music Player */}
          <div className="mt-8 md:mt-12 w-full">
            <MusicaDoDia />
          </div>
        </div>
      </main>
    </div>
  );
}