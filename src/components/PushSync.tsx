'use client';

import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { registerServiceWorker, syncSubscription } from '@/lib/pushClient';

/** Registra o service worker e mantém a inscrição de push ligada ao usuário logado. */
export default function PushSync() {
  const currentUser = useCurrentUser();
  const userId = currentUser?.id;

  useEffect(() => {
    registerServiceWorker()
      .then(() => (userId ? syncSubscription(userId) : undefined))
      .catch((error) => console.error('Error setting up push:', error));
  }, [userId]);

  return null;
}
