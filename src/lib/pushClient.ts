// Helpers de Web Push do lado do navegador.

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    Boolean(VAPID_PUBLIC_KEY)
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!isPushSupported()) return null;
  return navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' });
}

export async function getExistingSubscription() {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

async function saveSubscription(subscription: PushSubscription, userId: string) {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, subscription: subscription.toJSON() }),
  });
  return response.ok;
}

/** Pede permissão (precisa vir de um clique) e inscreve este dispositivo. */
export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  await registerServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  return saveSubscription(subscription, userId);
}

/**
 * Reenvia a inscrição atual ao servidor. Cobre troca de usuário no mesmo
 * aparelho e inscrições renovadas pelo navegador.
 */
export async function syncSubscription(userId: string) {
  if (!isPushSupported() || Notification.permission !== 'granted') return;
  const subscription = await getExistingSubscription();
  if (subscription) {
    await saveSubscription(subscription, userId);
  }
}

/** Para de receber notificações neste dispositivo (usado no logout). */
export async function removeSubscriptionFromServer() {
  if (!isPushSupported()) return;
  const subscription = await getExistingSubscription();
  if (!subscription) return;
  await fetch('/api/push/subscribe', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
    keepalive: true,
  });
}

/** Pede ao servidor para avisar o(a) outro(a) sobre a mensagem recém-enviada. */
export function notifyNewMessage(messageId: string) {
  // keepalive: a requisição termina mesmo se a aba for fechada logo após enviar
  fetch('/api/push/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId }),
    keepalive: true,
  }).catch((error) => console.error('Error requesting push notification:', error));
}
