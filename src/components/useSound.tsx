'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useSound(soundPath: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundPath);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundPath]);
  
  const play = useCallback(() => {
    if (audioRef.current) {
      // Reset the audio to the beginning if it's still playing
      audioRef.current.currentTime = 0;
      
      // Play the sound
      audioRef.current.play().catch(error => {
        // Handle any errors, often due to browser autoplay restrictions
        console.log('Error playing sound:', error);
      });
    }
  }, []);
  
  return play;
}