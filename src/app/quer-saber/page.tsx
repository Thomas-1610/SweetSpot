'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import PixelCard from '@/components/PixelCard';
import { getCurrentUser } from '@/lib/auth';

const subscribeToClient = (callback: () => void) => {
  const timer = window.setTimeout(callback, 0);
  return () => window.clearTimeout(timer);
};

const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function QuerSaberPage() {
  const router = useRouter();
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!getCurrentUser()) router.push('/login');
  }, [router]);

  if (!mounted || !getCurrentUser()) return null;

  return (
    <div className="min-h-screen bg-surface">
      <main className="md:pt-20 pt-16 min-h-screen bg-surface overflow-x-hidden">
        <div className="flex flex-col w-full max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16 gap-6 pb-[80px] md:pb-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-secondary-container flex items-center justify-center retro-border retro-shadow mb-6">
              <span className="material-symbols-outlined text-on-surface text-[44px]">auto_stories</span>
            </div>
            <h1 className="font-headline-lg uppercase tracking-tighter text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
              Quer saber?
            </h1>
            <p className="font-body-lg text-on-surface-variant mt-4" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Um cantinho para guardar coisas que quero dizer, lembranças e aquelas coisas aleatórias.
            </p>
          </div>

          <PixelCard className="flex flex-col gap-4">
            <h2 className="font-headline-sm uppercase text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
              Sabia que você fica LINDA de vestido?
            </h2>
            <p className="font-body-lg text-on-surface" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Por isso que te tive a ideia de te presentear com um :)
            </p>
          </PixelCard>
        </div>
      </main>
    </div>
  );
}
