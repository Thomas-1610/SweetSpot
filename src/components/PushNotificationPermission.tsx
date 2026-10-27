'use client'

import { usePushNotifications } from '@/hooks/usePushNotifications'
import PixelButton from './PixelButton'
import PixelCard from './PixelCard'

interface PushNotificationPermissionProps {
  userId: string
}

// Cartão inline: só aparece enquanto o aparelho ainda não recebe notificações
export default function PushNotificationPermission({ userId }: PushNotificationPermissionProps) {
  const { status, isSubscribing, subscribe } = usePushNotifications(userId)

  if (status === 'loading' || status === 'unsupported' || status === 'subscribed') {
    return null
  }

  if (status === 'denied') {
    return (
      <PixelCard className="flex items-start gap-3 bg-error-container text-on-error-container">
        <span className="material-symbols-outlined">notifications_off</span>
        <p className="font-body-md" style={{ fontFamily: 'var(--font-pixel-body)' }}>
          As notificações estão bloqueadas. Para receber avisos de novas mensagens, toque no cadeado
          ao lado do endereço do site, abra Permissões e ative Notificações.
        </p>
      </PixelCard>
    )
  }

  return (
    <PixelCard className="flex flex-col md:flex-row md:items-center gap-3">
      <p className="font-body-md text-on-surface flex-1" style={{ fontFamily: 'var(--font-pixel-body)' }}>
        Receba um aviso no celular quando chegar mensagem nova, mesmo com o site fechado 💕
      </p>
      <PixelButton
        variant="primary"
        size="sm"
        onClick={subscribe}
        disabled={isSubscribing}
        className="w-full md:w-auto"
      >
        <span className="material-symbols-outlined">notifications_active</span>
        <span>{isSubscribing ? 'Ativando...' : 'Ativar notificações'}</span>
      </PixelButton>
    </PixelCard>
  )
}
