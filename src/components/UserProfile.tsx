'use client';

import { useState, useEffect } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import { getCurrentUser, logoutUser, saveSession, User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profile_image_url: newPhotoUrl };
      setUser(updatedUser);
      saveSession(updatedUser);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-1 md:gap-2 p-1 md:p-2 hover:bg-surface-container transition-colors retro-border flex-shrink-0"
          style={{ borderRadius: '0' }}
        >
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.username}
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
              style={{ borderRadius: '0' }}
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-container flex items-center justify-center retro-border">
              <span className="material-symbols-outlined text-on-primary-container text-lg md:text-xl">person</span>
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
          <div className="absolute right-0 top-full mt-2 z-50 w-48 md:w-56 max-w-[calc(100vw-2rem)]">
            <PixelCard className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 p-2 border-b-[3px] border-on-surface">
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.username}
                    className="w-10 h-10 md:w-12 md:h-12 object-cover flex-shrink-0"
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
                  <p className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>
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
                <span>Alterar Foto</span>
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
