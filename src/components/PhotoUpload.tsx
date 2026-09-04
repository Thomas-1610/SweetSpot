'use client';

import { useState } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { uploadPhoto } from '@/lib/photos';
import { categoryLabels } from '@/lib/categoryLabels';

interface PhotoUploadProps {
  onUploadComplete?: () => void;
  onClose?: () => void;
}

export default function PhotoUpload({ onUploadComplete, onClose }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);

  const categories = Object.keys(categoryLabels);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadPhoto(file, title, description, category);
      if (result) {
        alert('Foto enviada com sucesso!');
        setFile(null);
        setTitle('');
        setDescription('');
        setCategory('');
        if (onUploadComplete) onUploadComplete();
        if (onClose) onClose();
      } else {
        alert('Upload não disponível. Configure o Supabase para usar esta funcionalidade.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao enviar foto. Verifique se o Supabase está configurado.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PixelCard className="flex flex-col gap-4">
      <h3 className="font-headline-sm uppercase tracking-tighter text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
        Adicionar Nova Foto
      </h3>

      <div className="flex flex-col gap-2">
        <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
          Foto *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md"
          style={{ borderRadius: '0' }}
        />
        {file && (
          <p className="font-body-sm text-on-surface-variant">
            Selecionado: {file.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Nossa primeira viagem"
          className="w-full p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-mana-blue"
          style={{ borderRadius: '0' }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
          Categoria *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-mana-blue"
          style={{ borderRadius: '0' }}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category} value={category}>{categoryLabels[category]}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva este momento especial..."
          className="w-full h-24 p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md resize-none focus:outline-none focus:border-mana-blue"
          style={{ borderRadius: '0' }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <PixelButton 
          variant="primary" 
          size="md"
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center justify-center gap-2 w-full sm:flex-1"
        >
          <span className="material-symbols-outlined">upload</span>
          <span>{uploading ? 'Enviando...' : 'Enviar'}</span>
        </PixelButton>
        <PixelButton 
          variant="outline" 
          size="md"
          onClick={onClose}
          disabled={uploading}
          className="w-full sm:flex-1"
        >
          <span>Cancelar</span>
        </PixelButton>
      </div>
    </PixelCard>
  );
}