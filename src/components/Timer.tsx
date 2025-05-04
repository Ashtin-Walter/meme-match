'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  gameStarted: boolean;
  gameOver: boolean;
}

export function Timer({ gameStarted, gameOver }: TimerProps) {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (gameOver) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameOver]);
  
  // Reset timer when game restarts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setTime(0);
    }
  }, [gameStarted, gameOver]);
  
  // Format the time (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-indigo-800 px-4 py-2 rounded-lg shadow-md flex items-center">
      <div className="text-xl font-bold font-mono">{formatTime()}</div>
    </div>
  );
}