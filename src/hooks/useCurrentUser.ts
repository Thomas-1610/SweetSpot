'use client';

import { useSyncExternalStore } from 'react';
import { getCurrentUser, subscribeToSession } from '@/lib/auth';

/** Keeps all client pages in sync with the locally stored session. */
export function useCurrentUser() {
  return useSyncExternalStore(subscribeToSession, getCurrentUser, () => null);
}
