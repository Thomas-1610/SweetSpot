'use client';

import { useState } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { Photo } from '@/lib/supabase';
import { deletePhoto } from '@/lib/photos';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onDelete: () => void;
}

export default function PhotoModal({ photo, onClose, onDelete }: PhotoModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} onClick={handleClose}>
      <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-auto ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`} onClick={(e) => e.stopPropagation()}>
        <PixelCard className="flex flex-col gap-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-error text-on-error w-10 h-10 retro-border flex items-center justify-center hover:bg-error-container"
            style={{ borderRadius: '0' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Image */}
          <div className="relative w-full">
            <img
              src={photo.image_url}
              alt={photo.title}
              className="w-full h-auto retro-border"
              style={{ borderRadius: '0' }}
            />
          </div>

          {/* Photo details */}
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-start border-b-[3px] border-on-surface pb-4">
              <div>
                <h2 className="font-headline-lg text-on-surface uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
                  {photo.title}
                </h2>
                <span className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>
                  {photo.date}
                </span>
              </div>
              <div className={`font-label-sm retro-border px-3 py-1 uppercase ${getCategoryColor(photo.category)}`}>
                {photo.category}
              </div>
            </div>

            <p className="font-body-md text-on-surface" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              {photo.description}
            </p>

            {/* Delete button */}
            <div className="flex justify-end mt-4">
              <PixelButton
                variant="outline"
                size="md"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-error text-error hover:bg-error hover:text-on-error"
              >
                <span className="material-symbols-outlined">delete</span>
                <span>{isDeleting ? 'Excluindo...' : 'Excluir Foto'}</span>
              </PixelButton>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
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
