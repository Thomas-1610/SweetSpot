'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';
// import PushNotificationPermission from '@/components/PushNotificationPermission';
import MessageModal from '@/components/MessageModal';
import { getMessages, sendMessage, deleteMessage } from '@/lib/messages';
import { Message } from '@/lib/supabase';
import { getCurrentUser, User } from '@/lib/auth';

export default function Mensagens() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadMessages();
  }, [router]);

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

  const handleDeleteMessage = () => {
    loadMessages();
    setSelectedMessage(null);
  };

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedMessageIds([]);
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedMessageIds.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedMessageIds.length} mensagem(ns)?`)) {
      return;
    }

    try {
      // Delete all selected messages
      await Promise.all(selectedMessageIds.map(id => deleteMessage(id)));
      loadMessages();
      setIsMultiSelectMode(false);
      setSelectedMessageIds([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
      alert('Erro ao excluir mensagens. Tente novamente.');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser) {
      try {
        const sentMessage = await sendMessage(currentUser.username, newMessage, currentUser.id);
        if (sentMessage) {
          setMessages([...messages, sentMessage]);
          setNewMessage('');
          setShowCompose(false);
        } else {
          // Fallback if Supabase is not configured
          const message: Message = {
            id: `${Date.now()}`,
            sender: currentUser.username,
            content: newMessage,
            timestamp: 'Agora',
            is_read: true,
            created_at: new Date().toISOString(),
            user_id: currentUser.id
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
      {/* <PushNotificationPermission userId="você" /> */}
      
      <main className="md:pt-20 pt-16 min-h-screen bg-surface overflow-x-hidden">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 gap-4 md:gap-6 pb-[80px] md:pb-12">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="font-headline-lg md:font-headline-lg text-on-surface uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
              Nossas Mensagens
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              Aqui voce pode deixar mensagens, todo tipo de mensagem que quiser. :)
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
                  className="flex-1 flex items-center justify-center gap-2"
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
              <div className="flex flex-col sm:flex-row gap-2">
                <PixelButton 
                  variant="primary" 
                  size="md"
                  onClick={handleSendMessage}
                  className="flex items-center justify-center gap-2 w-full sm:flex-1"
                >
                  <span className="material-symbols-outlined">send</span>
                  <span>Enviar</span>
                </PixelButton>
                <PixelButton 
                  variant="outline" 
                  size="md"
                  onClick={() => setShowCompose(false)}
                  className="w-full sm:flex-1"
                >
                  <span>Cancelar</span>
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Messages List */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm uppercase tracking-tighter text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
                Histórico de Mensagens
              </h3>
              
              <div className="flex gap-2">
                {/* Delete button in header when messages are selected */}
                {isMultiSelectMode && selectedMessageIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="w-8 h-8 flex items-center justify-center bg-error text-on-error hover:bg-error-container retro-border"
                    style={{ borderRadius: '0' }}
                    title={`Excluir ${selectedMessageIds.length} mensagem(ns)`}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
                
                {/* Multi-select toggle button */}
                <button
                  onClick={toggleMultiSelectMode}
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${isMultiSelectMode ? 'bg-primary text-on-primary retro-border' : 'bg-transparent text-on-surface'}`}
                  style={{ borderRadius: '0' }}
                  title={isMultiSelectMode ? 'Sair do modo seleção' : 'Selecionar múltiplas'}
                >
                  <span className="material-symbols-outlined">
                    {isMultiSelectMode ? 'close' : 'check_box'}
                  </span>
                </button>
              </div>
            </div>
            
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
                  <div 
                    key={message.id} 
                    className="cursor-pointer"
                    onClick={() => !isMultiSelectMode && setSelectedMessage(message)}
                  >
                    <PixelCard 
                      className={`flex flex-col gap-2 relative ${message.sender === 'Você' ? 'border-l-[4px] border-l-primary' : 'border-l-[4px] border-l-secondary'} ${selectedMessageIds.includes(message.id) ? 'bg-primary-container' : ''}`}
                    >
                      {/* Checkbox for multi-select mode */}
                      {isMultiSelectMode && (
                        <div 
                          className="absolute top-2 right-2 z-10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessageSelection(message.id);
                          }}
                        >
                          <div className={`w-6 h-6 flex items-center justify-center retro-border ${selectedMessageIds.includes(message.id) ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface'}`}>
                            {selectedMessageIds.includes(message.id) && (
                              <span className="material-symbols-outlined text-sm">check</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center border-b-[3px] border-on-surface pb-2 mb-2">
                        <span className={`font-label-sm uppercase ${message.sender === 'Você' ? 'text-primary' : 'text-primary'}`}>
                          {message.sender}
                        </span>
                        <span className="font-label-sm text-on-surface-variant">{message.timestamp}</span>
                      </div>
                      <p className="font-body-md text-on-surface">{message.content}</p>
                    </PixelCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onDelete={handleDeleteMessage}
        />
      )}
    </div>
  );
}