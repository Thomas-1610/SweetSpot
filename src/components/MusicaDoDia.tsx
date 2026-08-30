'use client';

import { useState, useRef } from 'react';
import { getPlaylistVideos, getRandomVideo } from '@/lib/youtubeApi';

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export default function MusicaDoDia() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadPlaylist = async () => {
    setLoading(true);
    const playlistVideos = await getPlaylistVideos();
    setVideos(playlistVideos);
    setLoading(false);
  };

  const handlePlayClick = async () => {
    if (processing || loading) return;
    
    setProcessing(true);
    
    if (videos.length === 0) {
      await loadPlaylist();
    }
    
    // Se já tiver vídeos, pega um aleatório (ou continua tocando o atual se já estava)
    if (videos.length > 0) {
      if (!currentVideo) {
        const randomVideo = getRandomVideo(videos);
        if (randomVideo) {
          setCurrentVideo(randomVideo);
        }
      }
      setIsPlaying(true);
      setIsPaused(false);
    }
    
    setProcessing(false);
  };

  const handlePause = () => {
    if (processing) return;
    setIsPaused(true);
  };

  const handleNext = async () => {
    if (processing || loading || videos.length === 0) return;
    
    setProcessing(true);
    const randomVideo = getRandomVideo(videos);
    if (randomVideo) {
      setCurrentVideo(randomVideo);
      setIsPlaying(true);
      setIsPaused(false);
    }
    setProcessing(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface retro-border retro-shadow-lg p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h3 className="font-headline-sm text-on-surface uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">music_note</span>
            Música do Dia
          </h3>
          <div className="h-[3px] w-full bg-[var(--border-black)]"></div>
        </div>

        {/* Content */}
        <div className="flex justify-between items-center mt-2">
          {/* Song Info */}
          <div className="flex flex-col overflow-hidden whitespace-nowrap pr-4">
            <span className="font-headline-md text-on-surface truncate">
              {currentVideo ? currentVideo.title : 'SweetSpot'}
            </span>
            <span className="font-label-lg text-on-surface-variant truncate mt-1">
              {currentVideo ? currentVideo.artist : 'Toque para iniciar'}
            </span>
          </div>
          
          {/* Controls */}
          <div className="flex gap-2 items-center flex-shrink-0">
            {/* Shuffle */}
            <button
              onClick={handleNext}
              disabled={processing || loading}
              className="w-10 h-10 bg-[#FFD13B] retro-border retro-shadow active-press flex items-center justify-center transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-black" style={{ fontVariationSettings: "'FILL' 1" }}>shuffle</span>
            </button>
            
            {/* Pause */}
            <button
              onClick={handlePause}
              disabled={processing || loading}
              className="w-10 h-10 bg-[#E83C85] retro-border retro-shadow active-press flex items-center justify-center transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
            </button>
            
            {/* Play */}
            <button
              onClick={handlePlayClick}
              disabled={processing || loading}
              className="w-10 h-10 bg-[#8CC63F] retro-border retro-shadow active-press flex items-center justify-center transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </button>
          </div>
        </div>

        {/* Iframe Escondido */}
        {isPlaying && currentVideo && (
          <div className="absolute opacity-0 pointer-events-none w-0 h-0">
            <iframe
              ref={iframeRef}
              width="100"
              height="100"
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1${isPaused ? '&mute=1' : ''}`}
              title="SweetSpot Random Player"
              allow="autoplay; encrypted-media"
            />
          </div>
        )}
      </div>
    </div>
  );
}