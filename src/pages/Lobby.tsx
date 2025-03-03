
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from '@/components/NavigationBar';
import { useGameContext } from '@/contexts/GameContext';
import PlayerProfile from '@/components/PlayerProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = {
        id: `custom-${Date.now()}`,
        name: newPlayerName,
        image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
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

  const handlePlayerSelect = (id: string) => {
    setSelectedPlayer(id);
  };

  const selectedPlayerData = players.find(p => p.id === selectedPlayer);

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
          
          {/* Middle and Right Columns */}
          <div className="lg:col-span-2 animate-fade-in">
            <Tabs defaultValue="players" className="w-full">
              <TabsList className="bg-game-dark w-full mb-4">
                <TabsTrigger value="players" className="flex-1">Houseguests</TabsTrigger>
                <TabsTrigger value="profiles" className="flex-1">Profiles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="players">
                <Card className="bg-game-medium border-none shadow-lg">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Houseguests</CardTitle>
                      
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
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {players.map((player) => (
                        <PlayerProfile 
                          key={player.id} 
                          player={player} 
                          onClick={() => handlePlayerSelect(player.id)}
                          showDetails
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profiles">
                <Card className="bg-game-medium border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Player Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {players.map((player) => (
                        <Dialog key={player.id}>
                          <DialogTrigger asChild>
                            <Card className="bg-game-dark hover:bg-game-light/20 cursor-pointer transition-colors">
                              <CardContent className="p-4 flex items-center gap-4">
                                <PlayerProfile 
                                  player={player} 
                                  size="sm"
                                />
                                <div>
                                  <h3 className="font-medium">{player.name}</h3>
                                  {player.alliances && player.alliances.length > 0 && (
                                    <Badge variant="outline" className="mt-1">{player.alliances[0]}</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="bg-game-medium">
                            <DialogHeader>
                              <DialogTitle>Player Profile</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                              <PlayerProfile player={player} size="lg" />
                              <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2">{player.name}</h2>
                                
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-400">Age</p>
                                    <p>{player.age || "Unknown"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Hometown</p>
                                    <p>{player.hometown || "Unknown"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Occupation</p>
                                    <p>{player.occupation || "Unknown"}</p>
                                  </div>
                                </div>
                                
                                <h3 className="font-semibold mt-4 mb-2">Game Stats</h3>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-game-dark p-2 rounded text-center">
                                    <p className="text-xs text-gray-400">HoH Wins</p>
                                    <p className="text-lg font-bold">{player.stats?.hohWins || 0}</p>
                                  </div>
                                  <div className="bg-game-dark p-2 rounded text-center">
                                    <p className="text-xs text-gray-400">PoV Wins</p>
                                    <p className="text-lg font-bold">{player.stats?.povWins || 0}</p>
                                  </div>
                                  <div className="bg-game-dark p-2 rounded text-center">
                                    <p className="text-xs text-gray-400">Nominated</p>
                                    <p className="text-lg font-bold">{player.stats?.timesNominated || 0}</p>
                                  </div>
                                </div>
                                
                                {player.alliances && player.alliances.length > 0 && (
                                  <>
                                    <h3 className="font-semibold mt-4 mb-2">Alliances</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {player.alliances.map(alliance => (
                                        <Badge key={alliance} variant="secondary">{alliance}</Badge>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
