// Configuração da Playlist do YouTube
// MODIFIQUE AQUI: Coloque o link completo da sua playlist do YouTube
// Exemplo: https://www.youtube.com/playlist?list=PLPWc0ri-YeEE
export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLPWc0ri-YeEE';

// YouTube Data API Key
// Crie uma API key em: https://console.cloud.google.com/apis/credentials
export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

// Extrair playlist ID da URL
export const getPlaylistId = (url: string) => {
  const match = url.match(/list=([^&]+)/);
  return match ? match[1] : '';
};