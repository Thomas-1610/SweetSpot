'use client';

import { useState } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { Message } from '@/lib/supabase';
import { deleteMessage } from '@/lib/messages';

interface MessageModalProps {
  message: Message;
  onClose: () => void;
  onDelete: () => void;
}

export default function MessageModal({ message, onClose, onDelete }: MessageModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // 200ms para aguardar a animação terminar
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteMessage(message.id);
      if (success) {
        onDelete();
        handleClose();
      } else {
        alert('Erro ao excluir mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erro ao excluir mensagem. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} onClick={handleClose}>
      <div 
        className={`relative w-full max-w-2xl ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <PixelCard className="flex flex-col gap-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-error hover:text-error-container transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Message content - no scroll */}
          <div className="flex flex-col gap-4 p-4 mt-2" style={{ maxHeight: 'calc(90vh - 80px)', overflow: 'hidden' }}>
            <div className="flex justify-between items-start border-b-[3px] border-on-surface pb-4">
              <div>
                <h2 className={`font-headline-lg uppercase tracking-tighter mb-2 ${message.sender === 'Você' ? 'text-primary' : 'text-secondary'}`} style={{ fontFamily: 'var(--font-pixel)' }}>
                  {message.sender}
                </h2>
                <span className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>
                  {message.timestamp}
                </span>
              </div>
              {message.is_read && (
                <div className="bg-primary-container text-on-primary-container font-label-sm retro-border px-2 py-1 uppercase mt-2">
                  Lida
                </div>
              )}
            </div>

            <p className="font-body-lg text-on-surface" style={{ fontFamily: 'var(--font-pixel-body)', wordBreak: 'break-word' }}>
              {message.content}
            </p>

            {/* Delete button */}
            <div className="flex justify-end mt-8">
              <PixelButton
                variant="primary"
                size="md"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 bg-error text-on-error hover:opacity-90 transition-transform active:scale-95"
                style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
              >
                <span className="material-symbols-outlined text-xl">delete</span>
                <span>{isDeleting ? 'Excluindo...' : 'Excluir'}</span>
              </PixelButton>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
