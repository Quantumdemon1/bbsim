
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import GameRoom from '@/components/GameRoom';
import { useGameContext } from '@/contexts/GameContext';

const Game = () => {
  const { gameState, players, resetGame } = useGameContext();
  const navigate = useNavigate();
  
  if (gameState !== 'playing') {
    navigate('/lobby');
    return null;
  }

  return (
    <div className="game-container">
      <NavigationBar />
      <GameRoom players={players} />
    </div>
  );
};

export default Game;
