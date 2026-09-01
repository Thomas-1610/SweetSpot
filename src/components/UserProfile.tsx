'use client';

import { useState, useSyncExternalStore } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import { getCurrentUser, logoutUser, saveSession, subscribeToSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const user = useSyncExternalStore(subscribeToSession, getCurrentUser, () => null);
  const [showMenu, setShowMenu] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleToggleMenu = () => {
    if (showMenu) {
      setIsMenuClosing(true);
      window.setTimeout(() => {
        setShowMenu(false);
        setIsMenuClosing(false);
      }, 180);
      return;
    }

    setIsMenuClosing(false);
    setShowMenu(true);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    window.setTimeout(() => {
      logoutUser();
      router.push('/login');
    }, 200);
  };

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    if (user) {
      saveSession({ ...user, profile_image_url: newPhotoUrl });
    }
  };

  if (!user) {
    return <div className="w-11 h-11 md:w-[52px] md:h-[52px] flex-shrink-0" aria-hidden />;
  }

  return (
    <>
      <div className={`relative ${isLoggingOut ? 'animate-page-out' : ''}`}>
        <button
          onClick={handleToggleMenu}
          className="flex items-center gap-1 md:gap-2 hover:bg-surface-container transition-colors flex-shrink-0"
          style={{ borderRadius: '0' }}
        >
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.username}
              className="w-11 h-11 md:w-[52px] md:h-[52px] object-cover retro-border"
              style={{ borderRadius: '0' }}
            />
          ) : (
            <div className="w-11 h-11 md:w-[52px] md:h-[52px] bg-primary-container flex items-center justify-center retro-border">
              <span className="material-symbols-outlined text-on-primary-container text-xl md:text-2xl">person</span>
            </div>
          )}
          <span className="font-label-sm text-on-surface hidden md:block whitespace-nowrap" style={{ fontFamily: 'var(--font-pixel)' }}>
            {user.username}
          </span>
          <span className="material-symbols-outlined text-on-surface text-lg md:text-xl">
            {showMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showMenu && (
          <div className={`absolute right-0 top-full mt-2 z-50 w-48 md:w-56 max-w-[calc(100vw-2rem)] ${isMenuClosing ? 'animate-menu-out' : 'animate-menu-in'}`}>
            <PixelCard className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 p-2 border-b-[3px] border-on-surface">
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.username}
                    className="w-10 h-10 md:w-12 md:h-12 object-cover flex-shrink-0 retro-border"
                    style={{ borderRadius: '0' }}
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-container flex items-center justify-center retro-border flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container text-xl md:text-2xl">person</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-label-sm text-on-surface truncate" style={{ fontFamily: 'var(--font-pixel)' }}>
                    {user.username}
                  </p>
                  <p className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)', color: 'var(--tertiary-container)' }}>
                    Online
                  </p>
                </div>
              </div>
              
              <PixelButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPhotoUpload(true);
                  setShowMenu(false);
                }}
                className="flex items-center justify-center gap-2 w-full text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                <span>Editar</span>
              </PixelButton>
              
              <PixelButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Sair</span>
              </PixelButton>
            </PixelCard>
          </div>
        )}
      </div>

      {showPhotoUpload && (
        <ProfilePhotoUpload
          user={user}
          onPhotoUpdated={handlePhotoUpdated}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </>
  );
}
