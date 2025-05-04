'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { Timer } from './Timer';
import { GameControls } from './GameControls';
import { useSound } from './useSound';

// Define the card type
export interface CardType {
  id: number;
  memeSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// List of memes we have in the public folder
const memeImages = [
  'confused-math-lady.jpg',
  'distracted-boyfriend.jpg',
  'doge.jpg',
  'evil-kermit.jpg',
  'expanding-brain.jpg',
  'hide-the-pain.jpg',
  'roll-safe.jpg',
  'this-is-fine.jpg',
];

// Define constant for base path - use this in all asset URLs
const BASE_PATH = '/games/original/meme-match';

export function MemeMatch() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const playFlipSound = useSound(`${BASE_PATH}/sounds/flip.mp3`);
  const playMatchSound = useSound(`${BASE_PATH}/sounds/match.mp3`);
  const playWinSound = useSound(`${BASE_PATH}/sounds/win.mp3`);

  // Initialize cards based on difficulty
  const initializeGame = useCallback(() => {
    let numPairs;
    switch (difficulty) {
      case 'easy':
        numPairs = 6; // 12 cards
        break;
      case 'hard':
        numPairs = 8; // 16 cards (all memes)
        break;
      case 'medium':
      default:
        numPairs = 7; // 14 cards
        break;
    }
    
    // Select random memes for this game
    const selectedMemes = [...memeImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);
    
    // Create pairs of cards with these memes
    const newCards: CardType[] = [];
    selectedMemes.forEach((meme) => {
      // Create two cards with the same meme (a pair)
      [1, 2].forEach(() => {
        newCards.push({
          id: newCards.length,
          memeSrc: `${BASE_PATH}/memes/${meme}`,
          isFlipped: false,
          isMatched: false,
        });
      });
    });
    
    // Shuffle the cards
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
  }, [difficulty]);

  // Start/restart the game
  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };

  // Handle card flip
  const handleCardFlip = (id: number) => {
    // Ignore if already two cards are flipped or this card is already flipped/matched
    if (flippedCards.length === 2) return;
    
    const card = cards.find(card => card.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Play flip sound
    playFlipSound();
    
    // Update the flipped state of the card
    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    
    setFlippedCards([...flippedCards, id]);
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      // Increment moves
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard && secondCard && firstCard.memeSrc === secondCard.memeSrc) {
        // It's a match!
        playMatchSound();
        
        // Mark cards as matched
        setCards(cards.map(card => 
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        
        setMatchedPairs(prevPairs => {
          const newPairs = prevPairs + 1;
          // Check for game over
          if (newPairs === cards.length / 2) {
            playWinSound();
            setGameOver(true);
          }
          return newPairs;
        });
        
        // Reset flipped cards
        setFlippedCards([]);
      } else {
        // Not a match, flip back after delay
        setTimeout(() => {
          setCards(cards.map(card => 
            flippedCards.includes(card.id) && !card.isMatched
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, playMatchSound, playWinSound, playFlipSound]);

  // Initialize game on first render or when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  const totalCards = cards.length;
  const cardGridCols = difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-4';

  return (
    <div className="flex flex-col items-center w-full">
      {!gameStarted ? (
        <div className="flex flex-col items-center gap-6 p-8 bg-indigo-700 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-yellow-300">Ready to Play?</h2>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Difficulty:</label>
              <select 
                className="p-2 bg-indigo-600 border border-indigo-400 rounded text-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              >
                <option value="easy">Easy (6 pairs)</option>
                <option value="medium">Medium (7 pairs)</option>
                <option value="hard">Hard (8 pairs)</option>
              </select>
            </div>
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4 gap-4">
            <GameControls 
              moves={moves} 
              pairs={matchedPairs} 
              totalPairs={totalCards / 2} 
              onRestart={startGame}
            />
            <Timer gameStarted={gameStarted} gameOver={gameOver} />
          </div>
          
          {gameOver && (
            <div className="bg-green-700 p-4 mb-6 rounded-lg text-center animate-bounce shadow-lg">
              <h2 className="text-2xl font-bold text-yellow-300">You Win!</h2>
              <p>You matched all pairs in {moves} moves!</p>
            </div>
          )}
          
          <div className={`grid ${cardGridCols} gap-3 md:gap-4 w-full`}>
            {cards.map(card => (
              <Card
                key={card.id}
                card={card}
                onClick={() => handleCardFlip(card.id)}
                disabled={flippedCards.length === 2 || gameOver}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}