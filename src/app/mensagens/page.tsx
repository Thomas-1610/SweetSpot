'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';
import { getMessages, sendMessage } from '@/lib/messages';
import { Message } from '@/lib/supabase';

export default function Mensagens() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Fallback to mock data if Supabase is not configured
      setMessages([
        {
          id: '1',
          sender: 'Namorada',
          content: 'Amor, não esqueça de comprar leite quando passar no mercado! Te amo ❤️',
          timestamp: 'Hoje, 14:30',
          is_read: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          sender: 'Você',
          content: 'Já comprei! Volto em breve. Te amo mais! 💕',
          timestamp: 'Hoje, 15:00',
          is_read: true,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const sentMessage = await sendMessage('Você', newMessage);
        if (sentMessage) {
          setMessages([...messages, sentMessage]);
          setNewMessage('');
          setShowCompose(false);
        } else {
          // Fallback if Supabase is not configured
          const message: Message = {
            id: `${Date.now()}`,
            sender: 'Você',
            content: newMessage,
            timestamp: 'Agora',
            is_read: true,
            created_at: new Date().toISOString()
          };
          setMessages([...messages, message]);
          setNewMessage('');
          setShowCompose(false);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header title="Mensagens" />
      <Navigation />
      
      <main className="md:pt-20 pt-16 min-h-screen bg-surface">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-6 py-6 md:py-12 gap-4 md:gap-6 pb-[80px] md:pb-12">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="font-headline-lg md:font-headline-lg text-on-surface uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
              Nossas Mensagens
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Deixe recadinhos fofos um para o outro aqui! 💕
            </p>
          </div>

          {/* Compose Section - Always visible on desktop */}
          <div className="hidden md:block">
            <PixelCard className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
                  Escreva sua mensagem:
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva algo fofo para mim..."
                  className="w-full h-32 p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md resize-none focus:outline-none focus:border-mana-blue"
                  style={{ borderRadius: '0' }}
                />
              </div>
              <div className="flex gap-2">
                <PixelButton 
                  variant="primary" 
                  size="md"
                  onClick={handleSendMessage}
                  className="flex-1"
                >
                  <span className="material-symbols-outlined">send</span>
                  <span>Enviar</span>
                </PixelButton>
              </div>
            </PixelCard>
          </div>

          {/* Mobile Compose Button */}
          <PixelButton 
            variant="primary" 
            size="md"
            className="md:hidden w-full flex items-center justify-center gap-2"
            onClick={() => setShowCompose(!showCompose)}
          >
            <span className="material-symbols-outlined">edit</span>
            <span>Nova Mensagem</span>
          </PixelButton>

          {/* Mobile Compose Form */}
          {showCompose && (
            <PixelCard className="md:hidden flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
                  Escreva sua mensagem:
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva algo fofo para mim..."
                  className="w-full h-32 p-4 retro-border bg-surface-container-lowest text-on-surface font-body-md resize-none focus:outline-none focus:border-mana-blue"
                  style={{ borderRadius: '0' }}
                />
              </div>
              <div className="flex gap-2">
                <PixelButton 
                  variant="primary" 
                  size="md"
                  onClick={handleSendMessage}
                  className="flex-1"
                >
                  <span className="material-symbols-outlined">send</span>
                  <span>Enviar</span>
                </PixelButton>
                <PixelButton 
                  variant="outline" 
                  size="md"
                  onClick={() => setShowCompose(false)}
                  className="flex-1"
                >
                  <span>Cancelar</span>
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Messages List */}
          <div className="flex flex-col gap-4 mt-4">
            <h3 className="font-headline-sm uppercase tracking-tighter text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
              Histórico de Mensagens
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>Carregando mensagens...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>Nenhuma mensagem ainda. Comece a conversa!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((message) => (
                  <PixelCard 
                    key={message.id} 
                    className={`flex flex-col gap-2 ${message.sender === 'Você' ? 'border-l-[4px] border-l-primary' : 'border-l-[4px] border-l-secondary'}`}
                  >
                    <div className="flex justify-between items-center border-b-[3px] border-on-surface pb-2 mb-2">
                      <span className={`font-label-sm uppercase ${message.sender === 'Você' ? 'text-primary' : 'text-secondary'}`}>
                        {message.sender}
                      </span>
                      <span className="font-label-sm text-on-surface-variant">{message.timestamp}</span>
                    </div>
                    <p className="font-body-md text-on-surface">{message.content}</p>
                  </PixelCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}