import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Load OneSignal SDK dynamically
declare global {
  interface Window {
    OneSignal?: any
  }
}

export function usePushNotifications(userId: string = 'você') {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOneSignalSDK()
  }, [])

  const loadOneSignalSDK = () => {
    // Load OneSignal SDK
    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      initializeOneSignal()
    }
  }

  const initializeOneSignal = async () => {
    try {
      if (!window.OneSignal) return

      // Initialize OneSignal
      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
          notifyButton: {
            enable: false,
          },
          allowLocalhostAsSecureOrigin: true,
        })
      })

      // Check current permission
      const currentPermission = await window.OneSignal.getNotificationPermission()
      setPermission(currentPermission)

      // Check if subscribed
      const isPushSubscribed = await window.OneSignal.isPushNotificationsEnabled()
      setIsSubscribed(isPushSubscribed)

      // Listen for permission changes
      window.OneSignal.on('notificationPermissionChange', (permissionChange: any) => {
        setPermission(permissionChange.to)
      })

      setIsLoading(false)
    } catch (error) {
      console.error('Error initializing OneSignal:', error)
      setIsLoading(false)
    }
  }

  const requestPermission = async () => {
    try {
      if (!window.OneSignal) {
        console.error('OneSignal not loaded')
        return false
      }

      const permission = await window.OneSignal.registerForPushNotifications()
      setPermission(permission)
      
      if (permission === 'granted') {
        const playerId = await window.OneSignal.getUserId()
        await savePushToken(playerId, userId)
        setIsSubscribed(true)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error requesting permission:', error)
      return false
    }
  }

  const savePushToken = async (pushToken: string, userId: string) => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized')
        return false
      }

      const { error } = await supabase
        .from('user_push_tokens')
        .upsert({
          user_id: userId,
          push_token: pushToken,
          platform: 'web',
        }, {
          onConflict: 'push_token'
        })

      if (error) {
        console.error('Error saving push token:', error)
        return false
      }

      console.log('Push token saved successfully')
      return true
    } catch (error) {
      console.error('Error saving push token:', error)
      return false
    }
  }

  return {
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
  }
}
