'use client';

import { useCallback, useEffect, useState } from 'react';
import { getExistingSubscription, isPushSupported, subscribeToPush } from '@/lib/pushClient';

export type PushStatus = 'loading' | 'unsupported' | 'default' | 'denied' | 'subscribed';

export function usePushNotifications(userId: string | undefined) {
  const [status, setStatus] = useState<PushStatus>('loading');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function readStatus(): Promise<PushStatus> {
      if (!isPushSupported()) return 'unsupported';
      if (Notification.permission === 'denied') return 'denied';
      if (Notification.permission !== 'granted') return 'default';
      const subscription = await getExistingSubscription();
      return subscription ? 'subscribed' : 'default';
    }

    readStatus().then((next) => {
      if (!cancelled) setStatus(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = useCallback(async () => {
    if (!userId) return false;
    setIsSubscribing(true);
    try {
      const ok = await subscribeToPush(userId);
      setStatus(ok ? 'subscribed' : Notification.permission === 'denied' ? 'denied' : 'default');
      return ok;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    } finally {
      setIsSubscribing(false);
    }
  }, [userId]);

  return { status, isSubscribing, subscribe };
}
