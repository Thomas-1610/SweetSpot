// Service Worker do SweetSpot — recebe Web Push mesmo com o site fechado.
// Não faz cache de páginas: o conteúdo vem sempre da rede.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Limpa o cache da versão antiga (OneSignal) que servia páginas desatualizadas
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.clients.claim()
    })()
  )
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }

  const title = data.title || '💌 Nova mensagem no SweetSpot'
  const url = data.url || '/mensagens'

  event.waitUntil(
    (async () => {
      // Avisa abas abertas para recarregarem a lista de mensagens
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      windows.forEach((client) => client.postMessage({ type: 'new-message' }))

      await self.registration.showNotification(title, {
        body: data.body || 'Você tem uma nova mensagem 💕',
        icon: '/icon-192.png',
        badge: '/badge-96.png',
        tag: data.tag || 'sweetspot-message',
        renotify: true,
        vibrate: [120, 60, 120],
        data: { url },
      })
    })()
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification.data?.url || '/mensagens', self.location.origin).href

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin && 'focus' in client) {
          await client.focus()
          return client.navigate(targetUrl)
        }
      }
      return self.clients.openWindow(targetUrl)
    })()
  )
})
