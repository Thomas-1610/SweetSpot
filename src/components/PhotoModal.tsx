'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { Photo } from '@/lib/supabase';
import { deletePhoto } from '@/lib/photos';
import { getCategoryLabel } from '@/lib/categoryLabels';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onDelete: () => void;
}

export default function PhotoModal({ photo, onClose, onDelete }: PhotoModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));

    return () => {
      cancelAnimationFrame(frame);
      setIsMounted(false);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deletePhoto(photo.id, photo.image_url);
      if (success) {
        onDelete();
        handleClose();
      } else {
        alert('Erro ao excluir foto. Tente novamente.');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Erro ao excluir foto. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={`${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        className={`${isClosing ? 'animate-modal-out' : 'animate-modal-in'} max-w-[26rem] md:max-w-[calc(100vw-48px)] lg:max-w-4xl`}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <PixelCard className="relative flex max-h-[calc(100dvh-24px)] flex-col gap-0 overflow-hidden md:h-[min(72dvh,38rem)] md:max-w-4xl md:flex-row">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex items-center justify-center text-error transition-colors hover:text-error-container md:right-4 md:top-4"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Image area */}
          <div
            className="relative w-full shrink-0 md:w-[56%] md:max-w-[56%]"
            style={{ aspectRatio: '6 / 5', overflow: 'hidden' }}
          >
            <div className="absolute inset-0">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="absolute inset-0 block h-full w-full object-cover retro-border"
                style={{ borderRadius: '0', imageRendering: 'auto' }}
              />
              <div className={`absolute bottom-2 right-2 ${getCategoryColor(photo.category)} font-label-sm retro-border px-2 py-1 uppercase`}>
                {getCategoryLabel(photo.category)}
              </div>
            </div>
          </div>

          {/* Photo details */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:justify-between md:p-6">
            <div>
              <div className="border-b-[3px] border-on-surface pb-3">
                <div className="min-w-0">
                  <h2 className="text-[18px] text-on-surface uppercase tracking-tighter md:text-xl" style={{ fontFamily: 'var(--font-pixel)', overflowWrap: 'anywhere' }}>
                    {photo.title}
                  </h2>
                  <span className="text-[10px] text-on-surface-variant md:text-xs" style={{ fontFamily: 'var(--font-pixel)' }}>
                    {photo.date}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[12px] leading-tight text-on-surface md:text-sm" style={{ fontFamily: 'var(--font-pixel-body)', overflowWrap: 'anywhere' }}>
                {photo.description}
              </p>
            </div>

            {/* Delete button */}
            <div className="flex justify-end pt-2">
              <PixelButton
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-error text-[10px] text-error hover:bg-error hover:text-on-error md:text-xs"
              >
                <span className="material-symbols-outlined">delete</span>
                <span>{isDeleting ? 'Excluindo...' : 'Excluir Foto'}</span>
              </PixelButton>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>,
    document.body,
  );
}

function getCategoryColor(category: string) {
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
}
