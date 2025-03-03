
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from '@/contexts/GameContext';
import Logo from '@/components/Logo';
import { Award } from 'lucide-react';
import PlayerAuth from '@/components/PlayerAuth';
import { PlayerData } from '@/components/PlayerProfileTypes';
import GameStatusBanner from '@/components/home/GameStatusBanner';
import GameModeTabs from '@/components/home/GameModeTabs';
import AuthButton from '@/components/home/AuthButton';

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
  useEffect(() => {
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
              <GameStatusBanner 
                isAuthenticated={isAuthenticated}
                isGuest={isGuest}
                currentPlayer={currentPlayer}
                countdownTimer={countdownTimer}
              />
              
              <GameModeTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hostName={hostName}
                gameId={gameId}
                playerName={playerName}
                onHostNameChange={(e) => setHostName(e.target.value)}
                onGameIdChange={(e) => setGameId(e.target.value.toUpperCase())}
                onPlayerNameChange={(e) => setPlayerName(e.target.value)}
                isAuthenticated={isAuthenticated}
                isGuest={isGuest}
                onStartSinglePlayer={handleCreateSinglePlayer}
                onCreateMultiplayerGame={handleCreateMultiplayerGame}
                onJoinMultiplayerGame={handleJoinMultiplayerGame}
              />

              {/* Login/Register buttons */}
              <div className="mt-4 flex space-x-2">
                <AuthButton 
                  isAuthenticated={isAuthenticated}
                  onClick={() => setShowAuth(true)}
                />
              </div>
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
