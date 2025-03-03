
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameStatusBannerProps {
  isAuthenticated: boolean;
  isGuest: boolean;
  currentPlayer: PlayerData | null;
  countdownTimer: number | null;
}

const GameStatusBanner: React.FC<GameStatusBannerProps> = ({ 
  isAuthenticated, 
  isGuest, 
  currentPlayer, 
  countdownTimer 
}) => {
  return (
    <>
      {/* Auth Status Banner */}
      {isAuthenticated && currentPlayer && (
        <div className="mb-4 p-2 bg-game-dark/50 rounded-md text-center">
          <p className="text-sm text-white">
            {isGuest 
              ? `Playing as guest: ${currentPlayer.name}` 
              : `Logged in as: ${currentPlayer.name}`}
          </p>
        </div>
      )}
      
      {/* Countdown Timer Display */}
      {countdownTimer !== null && (
        <div className="mb-4 p-2 bg-game-accent/50 rounded-md text-center">
          <p className="text-lg font-bold text-white">
            Game starts in: {countdownTimer} seconds
          </p>
        </div>
      )}
    </>
  );
};

export default GameStatusBanner;
