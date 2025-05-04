'use client';

interface GameControlsProps {
  moves: number;
  pairs: number;
  totalPairs: number;
  onRestart: () => void;
}

export function GameControls({ moves, pairs, totalPairs, onRestart }: GameControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="bg-indigo-800 px-4 py-2 rounded-lg shadow-md flex gap-4">
        <div>
          <span className="text-sm text-indigo-300">Moves:</span>
          <span className="ml-1 font-bold">{moves}</span>
        </div>
        <div>
          <span className="text-sm text-indigo-300">Pairs:</span>
          <span className="ml-1 font-bold">{pairs}/{totalPairs}</span>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg shadow-md transition-colors"
      >
        Restart Game
      </button>
    </div>
  );
}