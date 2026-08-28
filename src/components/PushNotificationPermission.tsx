'use client'

import { usePushNotifications } from '@/hooks/usePushNotifications'
import PixelButton from './PixelButton'
import PixelCard from './PixelCard'

interface PushNotificationPermissionProps {
  userId?: string
}

export default function PushNotificationPermission({ userId = 'você' }: PushNotificationPermissionProps) {
  const { permission, isSubscribed, isLoading, requestPermission } = usePushNotifications(userId)

  if (isLoading) {
    return null
  }

  if (permission === 'granted' && isSubscribed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <PixelCard className="p-3 bg-primary-container text-on-primary-container">
          <p className="font-body-sm text-center" style={{ fontFamily: 'var(--font-pixel-body)' }}>
            🔔 Notificações ativadas
          </p>
        </PixelCard>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <PixelCard className="p-3 bg-error-container text-on-error-container">
          <p className="font-body-sm text-center" style={{ fontFamily: 'var(--font-pixel-body)' }}>
            🔕 Notificações bloqueadas
          </p>
        </PixelCard>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <PixelCard className="p-4 max-w-sm">
        <p className="font-body-sm mb-3" style={{ fontFamily: 'var(--font-pixel-body)' }}>
          Receba notificações quando tiver novas mensagens! 💕
        </p>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={requestPermission}
          className="w-full"
        >
          <span className="material-symbols-outlined">notifications_active</span>
          <span>Ativar Notificações</span>
        </PixelButton>
      </PixelCard>
    </div>
  )
}
