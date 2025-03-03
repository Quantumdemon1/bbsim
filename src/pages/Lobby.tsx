
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import NavigationBar from '@/components/NavigationBar';
import { useGameContext } from '@/contexts/GameContext';
import PlayerProfile from '@/components/PlayerProfile';

const Lobby = () => {
  const { 
    gameId, 
    playerName, 
    isHost, 
    players, 
    setPlayers, 
    startGame, 
    resetGame 
  } = useGameContext();
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = {
        id: `custom-${players.length + 1}`,
        name: newPlayerName,
        image: '/placeholder.svg'
      };
      
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  const handleLeaveGame = () => {
    resetGame();
    navigate('/');
  };

  if (!gameId) {
    navigate('/');
    return null;
  }

  return (
    <div className="game-container">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Game Lobby</h1>
          <p className="text-xl text-gray-300">Game Code: <span className="font-mono font-bold text-game-accent">{gameId}</span></p>
          <p className="text-gray-400">You are playing as: <span className="font-medium text-white">{playerName}</span></p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Game Settings */}
          <div className="animate-slide-in">
            <Card className="bg-game-medium border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Game Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Season</label>
                    <select 
                      className="w-full bg-game-dark border border-game-light rounded-md p-2 text-white"
                      defaultValue="4"
                    >
                      <option value="4">Big Brother 4</option>
                      <option value="5">Big Brother 5</option>
                      <option value="6">Big Brother 6</option>
                      <option value="7">Big Brother All-Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Gameplay Speed</label>
                    <select 
                      className="w-full bg-game-dark border border-game-light rounded-md p-2 text-white"
                      defaultValue="normal"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      className="bg-game-dark hover:bg-game-light border border-white/20"
                      onClick={handleLeaveGame}
                    >
                      Leave Game
                    </Button>
                    
                    {isHost && (
                      <Button
                        className="bg-game-accent hover:bg-game-highlight text-black font-medium button-glow"
                        onClick={handleStartGame}
                      >
                        Start Game
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column: Players */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card className="bg-game-medium border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Houseguests</h2>
                  
                  {isHost && (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Add custom player"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        className="bg-game-dark border-game-light focus:border-game-accent"
                      />
                      <Button
                        variant="outline"
                        className="bg-game-dark hover:bg-game-light border border-white/20"
                        onClick={handleAddPlayer}
                        disabled={!newPlayerName.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {players.map((player) => (
                    <PlayerProfile key={player.id} player={player} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
