'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import PixelCard from '@/components/PixelCard';
import PhotoUpload from '@/components/PhotoUpload';
import PhotoModal from '@/components/PhotoModal';
import { getPhotos } from '@/lib/photos';
import { Photo } from '@/lib/supabase';
import { getCurrentUser, User } from '@/lib/auth';
import { getCategoryLabel } from '@/lib/categoryLabels';

const subscribeToClient = (callback: () => void) => {
  const timer = window.setTimeout(callback, 0);
  return () => window.clearTimeout(timer);
};

const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Galeria() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const isMounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadPhotos();
  }, [router]);

  const loadPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to load photos:', error);
      // Fallback to mock data if Supabase is not configured
      setPhotos([
        {
          id: '1',
          title: 'High Score!',
          description: 'Beat you at Pac-Man again. Better luck next time loser <3',
          image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXDO5KqZPGGXVrLK0oVMK-0TmtkI6inHv2qXFri5xvZZFfPMhk3kPZUTPqa-dCeTlu5ldbV8_pCWUwGZFWR9GosiENzmqcJrVi8re8cTiX1IK-8bnlrnBotT8188BLEAWy7E8ZPIFtaL5ejHvHkhEEX41ulxBFafjgDQASzNTcy4ghJYVQpFhfnU9vK79bsk5rkTYoiTczyH5RCVIs3KNxCxMDtkVQszghTsSFC4TE1hMhhbg8Qc',
          category: 'Arcade Date',
          date: '12 OCT',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'The Flour Incident',
          description: 'We tried making a cake. We ended up wearing the cake.',
          image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY0Wpc-0PLwABsFaryX3Ix2_zlfH30fk9LKlBqInRp3LsxOGewPGlUQ179_rIBEMyVESvwv1AYny8WgjOl9ed2pWdiDmScaIOq5udooqWtAoe1ujqEXPryt-dH5U_UjpMZTze3Rl0W_WTaR_MT3VBXTG4n3g4pCdpPAuEoxKpolfKqUBgTsyxRdttVevkcDPYkaAXClXfGLCbU0IwY_weLK6W5I9BQlIi0Td-kqenJPaDDfNeAjIQ',
          category: 'Baking Chaos',
          date: '04 OCT',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Cozy Sunday',
          description: 'Watching terrible rom-coms and drinking way too much hot cocoa.',
          image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaXwc-TVUbC8SOZdcuPWEkMK-4r2-RQtnJL_1cEBCoaC8vcSTCVM3CvkCHeJ7Z0UDSicAYk-haoFMFe4aSPLtxFw3mkSY1a0GLOM8PYeh-5bkZu5kmXTQ8ZL8enrgksnqZIRAJhlfsrxq-0vcdNJHVU1yIGl4yq9eC6yhzF5JTKO-407ZkCup7QL3c36eHDkiSMMtZrOjrPyR1w-dqCq0wHjx9SDODzXELKegWo82urzHfJEWCOBg',
          category: 'Movie Night',
          date: '28 SEP',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = () => {
    loadPhotos();
    setSelectedPhoto(null);
  };

  const handleUploadToggle = () => {
    const shouldOpen = !showUpload;
    setShowUpload(shouldOpen);

    if (shouldOpen) {
      window.requestAnimationFrame(() => {
        document.getElementById('photo-upload-form')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Arcade Date': 'bg-secondary-container text-on-secondary-container',
      'Baking Chaos': 'bg-tertiary-fixed text-on-tertiary-fixed',
      'Movie Night': 'bg-primary-container text-on-primary-container',
      'Viagem': 'bg-tertiary text-on-tertiary',
      'Jantar': 'bg-secondary-container text-on-secondary-container',
      'Fofura': 'bg-primary-container text-on-primary-container',
      'Celebration': 'bg-level-up-yellow text-on-surface',
      'Cozy': 'bg-growth-green text-on-surface',
    };
    return colors[category] || 'bg-surface-container text-on-surface';
  };

  return (
    <div className="min-h-screen bg-surface">
      <main className="md:pt-20 pt-16 min-h-screen bg-surface overflow-x-hidden">
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-32 md:pb-12">
          {showUpload && (
            <div id="photo-upload-form" className="scroll-mt-20 px-4 md:px-6 py-6">
              <PhotoUpload 
                onUploadComplete={() => {
                  loadPhotos();
                  setShowUpload(false);
                }}
                onClose={() => setShowUpload(false)}
              />
            </div>
          )}

          <div className="px-4 md:px-6 py-6 md:py-12">
            <div className="mb-8 md:mb-12">
              <h1 className="font-headline-lg md:font-headline-lg text-on-surface uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
                Nossa Galeria
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl" style={{ fontFamily: 'var(--font-pixel-body)' }}>
                Level completado! Aqui estão todos os nossos momentos salvos.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>Carregando fotos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>Nenhuma foto ainda. Adicione sua primeira memória!</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
                {photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="mb-6 md:mb-8 break-inside-avoid cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <PixelCard hover className="flex flex-col gap-4">
                      <div className="flex justify-end border-b-[3px] border-on-surface pb-1">
                        <span className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>{photo.date}</span>
                      </div>
                      <div className="relative w-full aspect-square retro-border">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={photo.title}
                          src={photo.image_url}
                        />
                        <div className={`absolute bottom-2 right-2 ${getCategoryColor(photo.category)} font-label-sm retro-border px-2 py-1 uppercase`}>
                          {getCategoryLabel(photo.category)}
                        </div>
                      </div>
                      <div>
                        <div className="border-b-[3px] border-on-surface pb-2 mb-2">
                          <span className="font-headline-sm tracking-tighter truncate block" style={{ fontFamily: 'var(--font-pixel)' }} title={photo.title}>{photo.title}</span>
                        </div>
                        <p className="font-body-md text-on-surface line-clamp-2" style={{ fontFamily: 'var(--font-pixel-body)' }}>{photo.description}</p>
                      </div>
                    </PixelCard>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Upload Button */}
          <div className="hidden md:flex justify-center mt-12">
            <button 
              className="bg-tertiary text-on-tertiary px-12 py-6 retro-border retro-shadow-lg active-press flex items-center gap-4 transition-transform hover:-translate-y-1"
              onClick={handleUploadToggle}
              style={{ borderRadius: '0' }}
            >
              <span className="material-symbols-outlined text-[32px]">add_box</span>
              <span className="font-headline-md uppercase tracking-tight" style={{ fontFamily: 'var(--font-pixel)' }}>Adicionar Nova Foto</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeletePhoto}
        />
      )}

      {isMounted && createPortal(
        <button
          className="md:hidden fixed right-6 z-[110] flex h-16 w-16 items-center justify-center bg-primary text-on-primary retro-border retro-shadow active-press transition-transform hover:-translate-y-0.5"
          onClick={handleUploadToggle}
          style={{
            borderRadius: '0',
            position: 'fixed',
            right: '1.5rem',
            bottom: 'calc(4rem + 1rem + env(safe-area-inset-bottom, 0px))',
          }}
          aria-label="Adicionar nova foto"
        >
          <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
        </button>,
        document.body,
      )}
    </div>
  );
}