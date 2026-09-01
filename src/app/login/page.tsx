'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { getCurrentUser, User } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAnimating(true);
    
    // Prevent scroll during animation
    document.body.style.overflow = 'hidden';
    
    // Verificar se já está logado
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.push('/');
      return;
    }
    
    // Enable scrolling after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      document.body.style.overflow = '';
    }, 350);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [router]);

  const handleLoginSuccess = (user: User) => {
    router.push('/');
  };

  if (!mounted) {
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
