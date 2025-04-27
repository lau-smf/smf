'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils/twcn';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create audio in a useEffect to ensure it only runs client-side
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio on the client side only
    const audioElement = new Audio('/music/music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.1;
    setAudio(audioElement);

    // Cleanup function
    return () => {
      audioElement.pause();
    };
  }, []);

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      id={'musicPlayer'}
      className={cn(
        'mt-5 flex space-x-2 items-center text-gray-500 border-gray-500 w-fit px-4 rounded-2xl opacity-10 transition-all duration-300 absolute top-0 right-0 m-5',
        (isHovered || isPlaying) && 'opacity-90',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlayPause}
    >
      Audio
      <div
        className={cn(
          'w-2 bg-gray-500 p-1 rounded-3xl ml-2',
          isPlaying && 'animate-pulse bg-sky-500',
        )}
      />
    </button>
  );
};
