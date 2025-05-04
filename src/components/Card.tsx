'use client';

import Image from 'next/image';
import { CardType } from './MemeMatch';
import { useState } from 'react';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export function Card({ card, onClick, disabled }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div 
      className={`
        relative aspect-square w-full h-auto 
        cursor-pointer transform transition-all duration-300 
        ${disabled && !card.isMatched ? 'pointer-events-none' : ''}
        ${card.isMatched ? 'opacity-80 scale-95' : 'hover:scale-105'}
      `}
      onClick={onClick}
    >
      <div 
        className={`
          absolute inset-0 w-full h-full rounded-lg shadow-md transition-all duration-500 transform-gpu 
          ${card.isFlipped ? 'rotateY-180' : ''}
          ${card.isMatched ? 'ring-4 ring-green-500' : ''}
        `}
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      >
        {/* Card Front (Hidden) */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center rounded-lg border-2 border-indigo-300
            ${card.isFlipped ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <span className="text-4xl font-bold text-white">?</span>
        </div>
        
        {/* Card Back (Meme) */}
        <div 
          className={`
            absolute inset-0 bg-white rounded-lg overflow-hidden
            flex items-center justify-center
            transform rotateY-180
            ${card.isFlipped ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="relative w-full h-full">
            <Image
              src={card.memeSrc} 
              alt="Meme card"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
            />
            <div className={`absolute inset-0 bg-gray-300 animate-pulse ${loaded ? 'opacity-0' : 'opacity-100'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these utility classes to handle the 3D flip effect
const styles = `
  .rotateY-180 {
    transform: rotateY(180deg);
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}