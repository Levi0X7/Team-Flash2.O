import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface GameHeaderProps {
  score: number;
  round: number;
  totalRounds: number;
  timeRemaining: number;
  onGoToMenu: () => void;
  onNewGame: () => void;
  onOpenSettings: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  round, 
  totalRounds,
  timeRemaining,
  onGoToMenu,
  onNewGame,
  onOpenSettings
}) => {
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="relative mb-4">
      {/* 3-dot menu in top-right corner */}
      <div className="absolute top-0 right-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem onClick={onGoToMenu}>
              <span className="mr-2">🏠</span> Menu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewGame}>
              <span className="mr-2">🎮</span> New Game
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSettings}>
              <span className="mr-2">⚙️</span> Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Game title */}
      <h1 className="text-4xl font-bold tracking-wider animate-scale-up text-center">
        <span className="text-primary">Word</span><span className="text-secondary">Scramble</span>
      </h1>
      
      {/* Game stats */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <div className="bg-white rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1">
          <i className="ri-timer-line text-primary"></i>
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
        
        <div className="bg-white rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1">
          <i className="ri-trophy-line text-secondary"></i>
          <span className="font-medium">{score}</span>
        </div>
        
        <div className="bg-white rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1">
          <i className="ri-game-line text-primary"></i>
          <span className="font-medium">{round}</span>/<span>{totalRounds}</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
