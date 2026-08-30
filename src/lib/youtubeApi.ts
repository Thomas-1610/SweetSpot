import { YOUTUBE_API_KEY, getPlaylistId, PLAYLIST_URL } from './musicConfig';

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export async function getPlaylistVideos(): Promise<Video[]> {
  const playlistId = getPlaylistId(PLAYLIST_URL);
  
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API Key não configurada');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    }));
  } catch (error) {
    console.error('Erro ao buscar vídeos da playlist:', error);
    return [];
  }
}

export function getRandomVideo(videos: Video[]): Video | null {
  if (videos.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * videos.length);
  return videos[randomIndex];
}