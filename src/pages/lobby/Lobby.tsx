
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useGameContext } from '@/contexts/GameContext';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import { PlayerData } from '@/components/PlayerProfileTypes';
import LobbyHeader from './components/LobbyHeader';
import LobbyTabs from './components/LobbyTabs';
import { useState } from 'react';

const Lobby = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-game-dark text-white border-game-accent mb-8">
          <CardHeader>
            <CardTitle className="text-game-accent text-2xl">Game Lobby</CardTitle>
            <CardDescription className="text-gray-400">
              Please sign in to access the lobby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="mb-4">Please sign in to create or join a game</p>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-game-accent text-black rounded hover:bg-game-highlight"
              >
                Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <LobbyHeader />
      <LobbyTabs onPlayerSelect={setSelectedPlayer} />
      
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
