'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PixelCard from '@/components/PixelCard';
import PhotoUpload from '@/components/PhotoUpload';
import PhotoModal from '@/components/PhotoModal';
import { getPhotos } from '@/lib/photos';
import { Photo } from '@/lib/supabase';

export default function Galeria() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

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
      <Header title="Galeria" />
      <Navigation />
      
      <main className="md:pt-20 pt-16 min-h-screen bg-surface">
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-32 md:pb-12">
          {showUpload && (
            <div className="px-6 py-6">
              <PhotoUpload 
                onUploadComplete={() => {
                  loadPhotos();
                  setShowUpload(false);
                }}
                onClose={() => setShowUpload(false)}
              />
            </div>
          )}

          <div className="px-6 py-6 md:py-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <PixelCard className="flex flex-col gap-4">
                      <div className="relative w-full aspect-square retro-border">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={photo.title}
                          src={photo.image_url}
                        />
                        <div className={`absolute bottom-2 right-2 ${getCategoryColor(photo.category)} font-label-sm retro-border px-2 py-1 uppercase`}>
                          {photo.category}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center border-b-[3px] border-on-surface pb-2 mb-2 gap-2">
                          <span className="font-headline-sm tracking-tighter truncate max-w-[65%]" style={{ fontFamily: 'var(--font-pixel)' }} title={photo.title}>{photo.title}</span>
                          <span className="font-label-sm text-on-surface-variant flex-shrink-0" style={{ fontFamily: 'var(--font-pixel)' }}>{photo.date}</span>
                        </div>
                        <p className="font-body-md text-on-surface line-clamp-2" style={{ fontFamily: 'var(--font-pixel-body)' }}>{photo.description}</p>
                      </div>
                    </PixelCard>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating Action Button - Mobile Only */}
          <button 
            className="md:hidden fixed bottom-[88px] right-6 w-16 h-16 bg-primary text-on-primary retro-border retro-shadow active-press flex items-center justify-center z-40 transition-transform hover:-translate-y-0.5"
            onClick={() => setShowUpload(!showUpload)}
            style={{ borderRadius: '0' }}
          >
            <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
          </button>

          {/* Desktop Upload Button */}
          <div className="hidden md:flex justify-center mt-12">
            <button 
              className="bg-tertiary text-on-tertiary px-12 py-6 retro-border retro-shadow-lg active-press flex items-center gap-4 transition-transform hover:-translate-y-1"
              onClick={() => setShowUpload(!showUpload)}
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
    </div>
  );
}