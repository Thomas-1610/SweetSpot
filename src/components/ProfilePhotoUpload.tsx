'use client';

import { useState } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { updateProfilePhoto } from '@/lib/profile';
import { User } from '@/lib/auth';

interface ProfilePhotoUploadProps {
  user: User;
  onPhotoUpdated: (newPhotoUrl: string) => void;
  onClose: () => void;
}

export default function ProfilePhotoUpload({ user, onPhotoUpdated, onClose }: ProfilePhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.profile_image_url || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione uma foto');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const photoUrl = await updateProfilePhoto(file, user.id);
      
      if (photoUrl) {
        onPhotoUpdated(photoUrl);
        onClose();
      } else {
        setError('Erro ao fazer upload da foto. Verifique se o bucket "profile-photos" existe no Supabase Storage.');
      }
    } catch (err) {
      setError('Erro ao processar upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <PixelCard className="flex flex-col gap-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-error hover:text-error-container transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <h3 className="font-headline-lg uppercase tracking-tighter text-on-surface text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
            Alterar Foto de Perfil
          </h3>

          {/* Current/Preview Photo */}
          <div className="flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover retro-border"
                style={{ borderRadius: '0' }}
              />
            ) : (
              <div className="w-32 h-32 bg-surface-container flex items-center justify-center retro-border">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">person</span>
              </div>
            )}
          </div>

          {/* File Input */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
              Nova Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md"
              style={{ borderRadius: '0' }}
              disabled={uploading}
            />
            {file && (
              <p className="font-body-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>
                Selecionado: {file.name}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-container text-on-error-container font-label-sm retro-border px-4 py-2 text-center">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <PixelButton
              variant="primary"
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">upload</span>
              <span>{uploading ? 'Enviando...' : 'Salvar'}</span>
            </PixelButton>
            <PixelButton
              variant="outline"
              onClick={onClose}
              disabled={uploading}
              className="flex-1"
            >
              <span>Cancelar</span>
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
