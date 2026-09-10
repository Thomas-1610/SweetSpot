'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function LoginPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser, router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 animate-login-in">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8 animate-login-in" style={{ animationDelay: '80ms' }}>
          <div className="w-20 h-20 mx-auto bg-primary-container flex items-center justify-center retro-border retro-shadow mb-4">
            <span className="material-symbols-outlined text-on-primary-container text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              favorite
            </span>
          </div>
          <h1 className="font-headline-lg uppercase tracking-tighter text-on-background mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
            SweetSpot
          </h1>
          <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>
            Nosso cantinho digital
          </p>
        </div>
        
        <div className="animate-login-in" style={{ animationDelay: '140ms' }}>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
}
