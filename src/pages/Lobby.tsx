
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Home, User, Users, Shield } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';
import ProfileCard from '@/components/profile/ProfileCard';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import { PlayerData } from '@/components/PlayerProfileTypes';

const Lobby = () => {
  const navigate = useNavigate();
  const { 
    gameId, 
    isHost, 
    playerName, 
    players, 
    startGame, 
    currentPlayer,
    isAuthenticated
  } = useGameContext();
  
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  
  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="bg-game-dark text-white border-game-accent mb-8">
        <CardHeader>
          <CardTitle className="text-game-accent text-2xl">Game Lobby</CardTitle>
          <CardDescription className="text-gray-400">
            {gameId ? `Room Code: ${gameId}` : 'Create or join a game to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
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
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">Please sign in to create or join a game</p>
              <Button onClick={() => navigate('/')}>
                Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="players" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 bg-game-dark">
          <TabsTrigger value="players" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Users className="mr-2 h-4 w-4" />
            Players
          </TabsTrigger>
          <TabsTrigger value="house" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Home className="mr-2 h-4 w-4" />
            House
          </TabsTrigger>
          <TabsTrigger value="alliances" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Shield className="mr-2 h-4 w-4" />
            Alliances
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map(player => (
              <ProfileCard 
                key={player.id} 
                player={player} 
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="house" className="space-y-4">
          <Card className="bg-game-dark border-game-accent p-4">
            <h3 className="text-xl font-semibold text-game-accent mb-2">The Big Brother House</h3>
            <p className="text-gray-300">
              Welcome to the Big Brother house, where 12 houseguests will compete in challenges, 
              form alliances, and vote each other out until only one remains to claim the grand prize.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-game-medium/50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Weekly Schedule</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Head of Household Competition</li>
                  <li>• Nomination Ceremony</li>
                  <li>• Power of Veto Competition</li>
                  <li>• Veto Ceremony</li>
                  <li>• Eviction Voting</li>
                </ul>
              </div>
              <div className="bg-game-medium/50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">House Rules</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Form alliances to strengthen your position</li>
                  <li>• Win competitions to secure your safety</li>
                  <li>• Build relationships with other houseguests</li>
                  <li>• Vote strategically at evictions</li>
                  <li>• Watch out for unexpected twists!</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <div className="bg-game-dark border border-game-accent/50 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-game-accent mb-2">Game Progress</h3>
            <div className="h-10 bg-game-medium/30 rounded-full overflow-hidden">
              <div className="h-full bg-game-accent" style={{ width: '0%' }}></div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Game has not started yet
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="alliances">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-game-dark border-game-accent/50 p-4">
              <h3 className="text-lg font-semibold text-game-accent mb-2">What are Alliances?</h3>
              <p className="text-gray-300 text-sm">
                Alliances are secret or public agreements between houseguests to work together, 
                protect each other, and vote together. A strong alliance can control the game and 
                carry its members to the end.
              </p>
              
              <h4 className="font-medium mt-4 mb-1">Alliance Strategies:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Build a small, loyal core alliance</li>
                <li>• Create side alliances for extra protection</li>
                <li>• Maintain good relationships outside your alliance</li>
                <li>• Win competitions to keep your alliance safe</li>
                <li>• Be careful who you trust with information</li>
              </ul>
            </Card>
            
            <Card className="bg-game-dark border-game-accent/50 p-4">
              <h3 className="text-lg font-semibold text-game-accent mb-2">Famous BB Alliances</h3>
              <div className="space-y-2">
                <div className="bg-game-medium/30 p-2 rounded">
                  <div className="font-medium">The Brigade</div>
                  <div className="text-xs text-gray-400">Season 12</div>
                </div>
                <div className="bg-game-medium/30 p-2 rounded">
                  <div className="font-medium">The Hitmen</div>
                  <div className="text-xs text-gray-400">Season 16</div>
                </div>
                <div className="bg-game-medium/30 p-2 rounded">
                  <div className="font-medium">The Cookout</div>
                  <div className="text-xs text-gray-400">Season 23</div>
                </div>
                <div className="bg-game-medium/30 p-2 rounded">
                  <div className="font-medium">Sovereign Six</div>
                  <div className="text-xs text-gray-400">Season 6</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedPlayer && (
        <PlayerProfileModal
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          player={selectedPlayer}
        />
      )}
    </div>
  );
};

export default Lobby;
