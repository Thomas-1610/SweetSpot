import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Server-only: usa a service_role key e a chave privada VAPID.
// Nunca importe este arquivo em componentes 'use client'.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;

export const isPushConfigured = Boolean(supabaseAdmin && vapidPublicKey && vapidPrivateKey);

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface StoredSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

/** Envia para cada inscrição e remove as que o serviço de push diz que expiraram. */
export async function sendPushToSubscriptions(subs: StoredSubscription[], payload: PushPayload) {
  const body = JSON.stringify(payload);
  const expired: string[] = [];
  let sent = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
          // urgency high: entrega imediata mesmo com o Android em modo Doze
          { TTL: 60 * 60 * 24, urgency: 'high' }
        );
        sent++;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          expired.push(sub.id);
        } else {
          console.error('Push send failed:', statusCode, (error as Error).message);
        }
      }
    })
  );

  if (expired.length > 0 && supabaseAdmin) {
    await supabaseAdmin.from('push_subscriptions').delete().in('id', expired);
  }

  return { sent, expired: expired.length };
}
