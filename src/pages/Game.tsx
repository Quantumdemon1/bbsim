
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import GameRoom from '@/components/GameRoom';
import { useGameContext } from '@/contexts/GameContext';
import GameActionsToolbar from '@/components/game-ui/GameActionsToolbar';

const Game = () => {
  const { gameState, players, resetGame } = useGameContext();
  const navigate = useNavigate();
  
  // Fix the navigation issue by using useEffect for conditional navigation
  useEffect(() => {
    if (gameState !== 'playing') {
      navigate('/lobby');
    }
  }, [gameState, navigate]);

  // Don't return null immediately, let the useEffect handle the navigation
  // This prevents the blank screen
  if (gameState !== 'playing') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <NavigationBar />
      <GameActionsToolbar players={players} />
      <GameRoom players={players} />
    </div>
  );
};

export default Game;
