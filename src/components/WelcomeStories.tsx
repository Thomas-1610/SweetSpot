'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';

const STORY_SEEN_PREFIX = 'sweetspot-welcome-seen:';

const stories = [
  {
    eyebrow: 'story 01',
    title: 'Oii, Esteer!',
    text: 'Tudo bem? Fiz isso pra tu ter um lugar pra dizer as coisas, tanto as boas quanto as ruins.',
    icon: 'favorite',
    accent: 'bg-primary-container',
  },
  {
    eyebrow: 'story 02',
    title: 'Nosso cantinho',
    text: 'Aqui a gente tem mensagens e uma galeria de fotos. Tu pode adicionar fotos e mensagens pra mim. E, se não quiser dizer algo diretamente, pode usar o sistema de mensagens.',
    icon: 'photo_library',
    accent: 'bg-secondary-container',
  },
  {
    eyebrow: 'story 03',
    title: 'E é isso!',
    text: 'Esse foi o último presente pra você. Feliz aniversário!!',
    icon: 'celebration',
    accent: 'bg-[#92b35a]',
  },
];

function getSeenKey(username: string) {
  return `${STORY_SEEN_PREFIX}${username.trim().toLowerCase()}`;
}

export default function WelcomeStories() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;

    const user = getCurrentUser();
    return user ? !window.localStorage.getItem(getSeenKey(user.username)) : false;
  });
  const [storyIndex, setStoryIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  const finish = () => {
    const user = getCurrentUser();
    if (user) window.localStorage.setItem(getSeenKey(user.username), 'true');
    setIsClosing(true);
    window.setTimeout(() => setIsVisible(false), 200);
  };

  const goToStory = (direction: 'next' | 'previous') => {
    if (isClosing) return;
    setStoryIndex((currentIndex) => {
      if (direction === 'next') return Math.min(currentIndex + 1, stories.length - 1);
      return Math.max(currentIndex - 1, 0);
    });
  };

  if (!isVisible) return null;

  const story = stories[storyIndex];
  const isLastStory = storyIndex === stories.length - 1;
  const storyTextColor = storyIndex === 0 || storyIndex === 2 ? 'text-white' : 'text-on-surface';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-on-surface/80 p-4 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
      <section
        className={`relative flex h-[92vh] w-full max-w-lg flex-col overflow-hidden bg-surface retro-border retro-shadow-lg ${isClosing ? 'animate-welcome-out' : 'animate-welcome-in'}`}
        aria-label="Boas-vindas ao SweetSpot"
      >
        <div key={storyIndex} className={`flex flex-1 flex-col justify-between p-6 sm:p-10 animate-story-change ${story.accent}`}>
          <div className="flex items-center justify-between gap-4">
            <span className={`font-label-sm uppercase ${storyTextColor}`}>SweetSpot</span>
            <button
              type="button"
              onClick={finish}
              className={`font-label-sm uppercase underline underline-offset-4 ${storyTextColor}`}
            >
              Pular
            </button>
          </div>

          <div className="flex flex-col items-center gap-7 py-12 text-center">
            {storyIndex === 0 && (
              <div className="flex h-24 w-24 items-center justify-center bg-surface retro-border retro-shadow">
                <span className="material-symbols-outlined text-[52px] text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {story.icon}
                </span>
              </div>
            )}
            {storyIndex > 0 && (
              <span className="material-symbols-outlined text-[52px] text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                {story.icon}
              </span>
            )}
            <div className="flex flex-col gap-4">
              <p className={`font-label-sm uppercase tracking-widest ${storyTextColor}`}>{story.eyebrow}</p>
              <h2 className={`font-headline-md uppercase ${storyTextColor}`} style={{ fontFamily: 'var(--font-pixel)' }}>
                {story.title}
              </h2>
              <p className={`font-body-lg ${storyTextColor}`} style={{ fontFamily: 'var(--font-pixel-body)' }}>
                {story.text}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goToStory('previous')}
              disabled={storyIndex === 0}
              className={`flex h-11 w-11 items-center justify-center ${storyTextColor} disabled:invisible`}
              aria-label="Story anterior"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              type="button"
              onClick={() => isLastStory ? finish() : goToStory('next')}
              className="flex h-11 items-center gap-2 bg-primary px-4 font-label-sm uppercase text-on-primary retro-border"
            >
              <span>{isLastStory ? 'Começar' : 'Próximo'}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 bg-surface px-6 py-5 sm:px-10" aria-label="Progresso dos stories">
          {stories.map((currentStory, index) => (
            <button
              key={currentStory.eyebrow}
              type="button"
              onClick={() => setStoryIndex(index)}
              className={`h-2 flex-1 ${index <= storyIndex ? 'bg-primary' : 'bg-surface-container-highest'}`}
              aria-label={`Ir para ${currentStory.eyebrow}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}