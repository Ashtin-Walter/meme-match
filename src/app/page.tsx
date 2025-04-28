"use client"

import { useState } from "react";
import Image from "next/image";
import { getAllMemes } from "@/lib/memes";

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  // Get memes from our service
  const memes = getAllMemes();

  // Card type definition
  type Card = {
    id: number;
    memeId: number;
    name: string;
    path: string;
    flipped: boolean;
    matched: boolean;
  };

  // Initialize and shuffle cards
  const initializeGame = () => {
    // Create pairs of each meme (duplicate the array)
    const duplicatedMemes = [...memes, ...memes].map((meme, index) => ({
      id: index,
      memeId: meme.id,
      name: meme.name,
      path: meme.path,
      flipped: false,
      matched: false,
    }));

    // Shuffle the cards
    const shuffledCards = duplicatedMemes.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    // Don't allow clicks if game is over or if already 2 cards flipped
    if (gameOver || flippedCards.length >= 2) return;
    
    // Find the clicked card
    const clickedCard = cards.find(card => card.id === cardId);
    
    // Don't allow clicking already matched or flipped cards
    if (!clickedCard || clickedCard.matched || clickedCard.flipped) return;
    
    // Create a new array with the flipped card
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    );
    
    // Update cards and add to flipped cards
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);
    
    // If this is the second card flipped, check for a match
    if (flippedCards.length === 1) {
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = clickedCard;
      
      // Increment moves
      setMoves(prevMoves => prevMoves + 1);
      
      // Check if the cards match (same memeId)
      if (firstCard && firstCard.memeId === secondCard.memeId) {
        // Mark both cards as matched
        const matchedCards = newCards.map(card => 
          card.id === firstCardId || card.id === cardId 
            ? { ...card, matched: true } 
            : card
        );
        
        // Update matched pairs
        const newMatchedPairs = matchedPairs + 1;
        
        // Check if game is over (all pairs matched)
        const isGameOver = newMatchedPairs === memes.length;
        
        // Update state
        setTimeout(() => {
          setCards(matchedCards);
          setMatchedPairs(newMatchedPairs);
          setFlippedCards([]);
          if (isGameOver) setGameOver(true);
        }, 500);
      } else {
        // If no match, flip cards back after a delay
        setTimeout(() => {
          setCards(newCards.map(card => 
            card.id === firstCardId || card.id === cardId 
              ? { ...card, flipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Meme Match</h1>
        <p className="text-lg mb-6">Match the meme pairs to win!</p>
        
        {!gameStarted ? (
          <button 
            onClick={initializeGame}
            className="bg-foreground text-background px-8 py-3 rounded-full font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
          >
            Start Game
          </button>
        ) : (
          <div className="flex flex-wrap items-center justify-between w-full max-w-md gap-4">
            <div className="text-lg">
              <span className="font-medium">Moves:</span> {moves}
            </div>
            <div className="text-lg">
              <span className="font-medium">Matches:</span> {matchedPairs}/{memes.length}
            </div>
            <button 
              onClick={initializeGame}
              className="bg-foreground text-background px-4 py-2 text-sm rounded-full font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              Reset Game
            </button>
          </div>
        )}
      </header>

      {gameStarted && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl mb-8">
            {cards.map(card => (
              <div 
                key={card.id} 
                className={`
                  aspect-square rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300
                  ${card.flipped || card.matched ? 'rotate-0' : 'rotate-y-180 bg-foreground'}
                  ${card.matched ? 'opacity-70' : 'opacity-100'}
                  hover:shadow-lg
                `}
                onClick={() => handleCardClick(card.id)}
              >
                {(card.flipped || card.matched) ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={card.path}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-foreground flex items-center justify-center text-background">
                    <span className="text-2xl font-bold">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-background p-8 rounded-xl max-w-md text-center">
                <h2 className="text-3xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
                <p className="text-xl mb-6">You completed the game in {moves} moves!</p>
                <button 
                  onClick={initializeGame}
                  className="bg-foreground text-background px-8 py-3 rounded-full font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="mt-auto pt-8">
        <p className="text-sm opacity-70">Meme Match Game - Created with Next.js and Tailwind CSS</p>
      </footer>
    </div>
  );
}
