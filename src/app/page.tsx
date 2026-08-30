import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Header title="Home" />
      <Navigation />
      
      <main className="md:pt-20 pt-16 min-h-screen bg-surface">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-6 py-6 md:py-12 gap-4 md:gap-8 pb-[80px] md:pb-12">
          {/* Welcome Section */}
          <div className="flex flex-col items-center justify-center py-8 md:py-16">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-container flex items-center justify-center retro-border retro-shadow active-press transition-transform mb-4 md:mb-6">
              <span className="material-symbols-outlined text-on-primary-container text-[40px] md:text-[56px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                favorite
              </span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-background uppercase tracking-tighter text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
              Oi Amor!
            </h2>
            <p className="font-body-md md:font-body-lg text-on-surface-variant text-center mt-2 md:mt-4 max-w-2xl" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Pronta para mais uma fase?
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

          {/* Music Section */}
          <div className="mt-8 md:mt-12 w-full max-w-2xl mx-auto">
            <PixelCard className="flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
              
              <div className="border-b-[3px] border-on-surface pb-2 mb-2 relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[20px]">music_note</span>
                <h3 className="font-label-sm md:font-label-lg uppercase tracking-widest text-on-surface">Música do Dia</h3>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="font-headline-sm md:font-headline-md text-on-surface leading-tight" style={{ fontFamily: 'var(--font-pixel)' }}>Perfect</span>
                  <span className="font-body-sm md:font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>Ed Sheeran</span>
                </div>
                <button className="w-10 h-10 md:w-12 md:h-12 bg-tertiary-container text-on-tertiary-container retro-border flex items-center justify-center retro-shadow active-press transition-transform">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    play_arrow
                  </span>
                </button>
              </div>
            </PixelCard>
          </div>
        </div>
      </main>
    </div>
  );
}