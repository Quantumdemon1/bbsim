
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from '@/contexts/GameContext';
import Logo from '@/components/Logo';
import { Users, Award, Crown } from 'lucide-react';

const Index = () => {
  const [hostName, setHostName] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  
  const { createGame, joinGame } = useGameContext();
  const navigate = useNavigate();

  const handleCreateGame = () => {
    if (hostName.trim()) {
      createGame(hostName);
      navigate('/lobby');
    }
  };

  const handleJoinGame = () => {
    if (gameId.trim() && playerName.trim()) {
      joinGame(gameId, playerName);
      navigate('/lobby');
    }
  };

  return (
    <div className="game-container">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="mb-10 animate-scale-in">
          <Logo />
        </div>
        
        <div className="w-full max-w-md animate-fade-in">
          <Card className="modern-card border-none shadow-xl bg-white/10 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-white">Big Brother Simulator</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Create or join a multiplayer game
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex mb-6">
                <Button 
                  variant={activeTab === 'create' ? 'default' : 'outline'}
                  className={`flex-1 rounded-r-none ${activeTab === 'create' ? 'bg-game-accent text-white' : 'bg-game-dark border-white/20 text-white/70'}`}
                  onClick={() => setActiveTab('create')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Create Game
                </Button>
                <Button 
                  variant={activeTab === 'join' ? 'default' : 'outline'}
                  className={`flex-1 rounded-l-none ${activeTab === 'join' ? 'bg-game-accent text-white' : 'bg-game-dark border-white/20 text-white/70'}`}
                  onClick={() => setActiveTab('join')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Game
                </Button>
              </div>
              
              {activeTab === 'create' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="bg-white/5 border-white/20 focus:border-game-accent text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Game Code</label>
                    <Input
                      type="text"
                      placeholder="Enter game code"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value.toUpperCase())}
                      className="bg-white/5 border-white/20 focus:border-game-accent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="bg-white/5 border-white/20 focus:border-game-accent text-white"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              {activeTab === 'create' ? (
                <Button 
                  className="w-full gradient-button py-5 text-lg"
                  onClick={handleCreateGame}
                  disabled={!hostName.trim()}
                >
                  Create Game
                </Button>
              ) : (
                <Button 
                  className="w-full gradient-button py-5 text-lg"
                  onClick={handleJoinGame}
                  disabled={!gameId.trim() || !playerName.trim()}
                >
                  Join Game
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 text-gray-400 text-sm animate-fade-in">
          <p className="text-center">A multiplayer simulation of the Big Brother TV show.</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <Award className="w-4 h-4 text-game-accent" />
            <p className="text-center">Create a game and invite friends to play!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
