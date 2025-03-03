
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from '@/contexts/useGameContext';
import Logo from '@/components/Logo';
import { Award, KeyRound, Wrench } from 'lucide-react';
import PlayerAuth from '@/components/PlayerAuth';
import { PlayerData } from '@/components/PlayerProfileTypes';
import GameStatusBanner from '@/components/home/GameStatusBanner';
import GameModeTabs from '@/components/home/GameModeTabs';
import AuthButton from '@/components/home/AuthButton';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [hostName, setHostName] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'multi-create' | 'multi-join'>('single');
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminControls, setShowAdminControls] = useState(false);
  
  const { 
    isAuthenticated, 
    isGuest, 
    isAdmin,
    currentPlayer, 
    login, 
    register, 
    loginAsGuest,
    loginAsAdmin,
    createSinglePlayerGame,
    createMultiplayerGame,
    joinMultiplayerGame,
    countdownTimer
  } = useGameContext();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentPlayer) {
      setPlayerName(currentPlayer.name);
      setHostName(currentPlayer.name);
    }
  }, [isAuthenticated, currentPlayer]);

  const handleCreateSinglePlayer = () => {
    if ((!isAuthenticated || isGuest) && !isAdmin) {
      setShowAuth(true);
      return;
    }
    
    if (createSinglePlayerGame(isAdmin)) {
      navigate('/game');
    }
  };

  const handleCreateMultiplayerGame = () => {
    if (hostName.trim()) {
      if (!isAuthenticated) {
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

  const handleAdminModeToggle = () => {
    setShowAdminControls(!showAdminControls);
  };

  const handleLoginAsAdmin = () => {
    loginAsAdmin();
    setPlayerName('Game Admin');
    setHostName('Game Admin');
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
              <GameStatusBanner 
                isAuthenticated={isAuthenticated}
                isGuest={isGuest}
                currentPlayer={currentPlayer}
                countdownTimer={countdownTimer}
              />
              
              <GameModeTabs 
                isAuthenticated={isAuthenticated} 
                isGuest={isGuest}
                onStartSinglePlayer={handleCreateSinglePlayer} 
              />

              <div className="mt-4 flex space-x-2">
                <AuthButton 
                  isAuthenticated={isAuthenticated}
                  onClick={() => setShowAuth(true)}
                />
                
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={handleAdminModeToggle}
                  className="ml-2"
                >
                  <Wrench className="h-4 w-4" />
                </Button>
              </div>
              
              {showAdminControls && (
                <div className="mt-4 p-3 border border-dashed border-amber-500 rounded-md bg-amber-950/30">
                  <h3 className="text-amber-400 text-sm font-medium mb-2 flex items-center">
                    <KeyRound className="mr-1 h-3.5 w-3.5" />
                    Admin Testing Tools
                  </h3>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLoginAsAdmin}
                      className="bg-amber-950/50 border-amber-700 hover:bg-amber-900 text-amber-300"
                    >
                      Login as Admin
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCreateSinglePlayer}
                      className="bg-amber-950/50 border-amber-700 hover:bg-amber-900 text-amber-300"
                    >
                      Test Single Player Game
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCreateMultiplayerGame}
                        className="bg-amber-950/50 border-amber-700 hover:bg-amber-900 text-amber-300"
                      >
                        Test Create Multiplayer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleJoinMultiplayerGame}
                        className="bg-amber-950/50 border-amber-700 hover:bg-amber-900 text-amber-300"
                      >
                        Test Join Multiplayer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
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
