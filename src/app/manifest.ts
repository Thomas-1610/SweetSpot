import type { MetadataRoute } from 'next';

// Permite "Adicionar à tela inicial" no Android: o SweetSpot vira um app
// com ícone próprio, e as notificações aparecem com o nome dele.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SweetSpot - Nosso Cantinho',
    short_name: 'SweetSpot',
    description: 'Um espaço digital compartilhado para nós dois, feito com pixels.',
    start_url: '/',
    display: 'standalone',
    background_color: '#d23284',
    theme_color: '#b10e6b',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
