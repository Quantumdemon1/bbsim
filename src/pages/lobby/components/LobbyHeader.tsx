
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChevronRight, User } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';

const LobbyHeader = () => {
  const navigate = useNavigate();
  const { 
    gameId, 
    isHost, 
    startGame, 
    currentPlayer,
  } = useGameContext();
  
  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  return (
    <Card className="bg-game-dark text-white border-game-accent mb-8">
      <CardHeader>
        <CardTitle className="text-game-accent text-2xl">Game Lobby</CardTitle>
        <CardDescription className="text-gray-400">
          {gameId ? `Room Code: ${gameId}` : 'Create or join a game to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-game-medium/50 p-4 rounded-lg">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-game-dark rounded-full flex items-center justify-center mr-3">
              {currentPlayer?.image ? (
                <img 
                  src={currentPlayer.image} 
                  alt={currentPlayer.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{currentPlayer?.name}</h3>
              <p className="text-sm text-gray-400">
                {isHost ? 'Game Host' : 'Player'}
              </p>
            </div>
          </div>
          
          {isHost && (
            <Button onClick={handleStartGame} className="bg-game-accent text-black hover:bg-game-highlight">
              Start Game
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LobbyHeader;
