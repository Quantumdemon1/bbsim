
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from '@/contexts/GameContext';
import Logo from '@/components/Logo';
import { Users, Award, Crown, LogIn, UserPlus, User, Bot } from 'lucide-react';
import PlayerAuth from '@/components/PlayerAuth';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [hostName, setHostName] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'multi-create' | 'multi-join'>('single');
  const [showAuth, setShowAuth] = useState(false);
  
  const { 
    isAuthenticated, 
    isGuest, 
    currentPlayer, 
    login, 
    register, 
    loginAsGuest,
    createSinglePlayerGame,
    createMultiplayerGame,
    joinMultiplayerGame,
    countdownTimer
  } = useGameContext();
  
  const navigate = useNavigate();

  // Set player name if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && currentPlayer) {
      setPlayerName(currentPlayer.name);
      setHostName(currentPlayer.name);
    }
  }, [isAuthenticated, currentPlayer]);

  const handleCreateSinglePlayer = () => {
    if (!isAuthenticated || isGuest) {
      setShowAuth(true);
      return;
    }
    
    if (createSinglePlayerGame()) {
      navigate('/game');
    }
  };

  const handleCreateMultiplayerGame = () => {
    if (hostName.trim()) {
      if (!isAuthenticated) {
        // Login as guest if not authenticated
        loginAsGuest(hostName);
      }
      if (createMultiplayerGame(hostName)) {
        navigate('/lobby');
      }
    }
  };

  const handleJoinMultiplayerGame = () => {
    if (gameId.trim() && playerName.trim()) {
      if (!isAuthenticated) {
        // Login as guest if not authenticated
        loginAsGuest(playerName);
      }
      if (joinMultiplayerGame(gameId, playerName)) {
        navigate('/lobby');
      }
    }
  };

  const handleLogin = (player: PlayerData) => {
    login(player);
    setPlayerName(player.name);
    setHostName(player.name);
  };

  const handleRegister = (player: PlayerData) => {
    register(player);
    setPlayerName(player.name);
    setHostName(player.name);
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
                Choose your game mode
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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

              <Tabs defaultValue="single" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="single" 
                    onClick={() => setActiveTab('single')}
                    className={activeTab === 'single' ? 'bg-game-accent text-white' : ''}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Single Player
                  </TabsTrigger>
                  <TabsTrigger 
                    value="multi-create" 
                    onClick={() => setActiveTab('multi-create')}
                    className={activeTab === 'multi-create' ? 'bg-game-accent text-white' : ''}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Create Game
                  </TabsTrigger>
                  <TabsTrigger 
                    value="multi-join" 
                    onClick={() => setActiveTab('multi-join')}
                    className={activeTab === 'multi-join' ? 'bg-game-accent text-white' : ''}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Game
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="space-y-4 mt-4">
                  <div className="bg-game-dark/40 rounded-lg p-4 text-white">
                    <h3 className="font-semibold flex items-center">
                      <User className="w-4 h-4 mr-2 text-game-accent" />
                      Play against AI contestants
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">
                      Test your skills against AI-controlled contestants. You need a registered account to play in single player mode.
                    </p>
                    
                    {isAuthenticated && !isGuest ? (
                      <div className="mt-4">
                        <p className="text-sm text-game-accent mb-2">
                          Ready to start your Big Brother journey!
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="text-sm text-yellow-400 mb-2">
                          You need to be registered to play single player mode
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="multi-create" className="space-y-4 mt-4">
                  <div className="bg-game-dark/40 rounded-lg p-4 text-white">
                    <h3 className="font-semibold flex items-center">
                      <Crown className="w-4 h-4 mr-2 text-game-accent" />
                      Create a Multiplayer Game
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">
                      Host your own game and invite friends to join. Game will start automatically when enough players join or time runs out.
                    </p>
                    
                    <div className="mt-4">
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
                </TabsContent>
                
                <TabsContent value="multi-join" className="space-y-4 mt-4">
                  <div className="bg-game-dark/40 rounded-lg p-4 text-white">
                    <h3 className="font-semibold flex items-center">
                      <Users className="w-4 h-4 mr-2 text-game-accent" />
                      Join a Multiplayer Game
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">
                      Join an existing game using the game code provided by the host.
                    </p>
                    
                    <div className="mt-4 space-y-4">
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
                  </div>
                </TabsContent>
              </Tabs>

              {/* Login/Register buttons */}
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-game-dark/40 border-white/20 text-white/90 hover:bg-game-light/20"
                  onClick={() => setShowAuth(true)}
                >
                  {isAuthenticated ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Profile
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
            
            <CardFooter>
              {activeTab === 'single' ? (
                <Button 
                  className="w-full gradient-button py-5 text-lg"
                  onClick={handleCreateSinglePlayer}
                  disabled={!isAuthenticated || isGuest}
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Start Single Player
                </Button>
              ) : activeTab === 'multi-create' ? (
                <Button 
                  className="w-full gradient-button py-5 text-lg"
                  onClick={handleCreateMultiplayerGame}
                  disabled={!hostName.trim()}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Create Multiplayer Game
                </Button>
              ) : (
                <Button 
                  className="w-full gradient-button py-5 text-lg"
                  onClick={handleJoinMultiplayerGame}
                  disabled={!gameId.trim() || !playerName.trim()}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Multiplayer Game
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

      {/* Login/Registration Dialog */}
      <PlayerAuth 
        open={showAuth} 
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;
