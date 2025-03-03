
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinMultiplayerTabProps {
  gameId: string;
  playerName: string;
  onGameIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlayerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onJoinMultiplayerGame: () => void;
}

const JoinMultiplayerTab: React.FC<JoinMultiplayerTabProps> = ({ 
  gameId, 
  playerName, 
  onGameIdChange, 
  onPlayerNameChange, 
  onJoinMultiplayerGame 
}) => {
  return (
    <div className="space-y-4 mt-4">
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
              onChange={onGameIdChange}
              className="bg-white/5 border-white/20 focus:border-game-accent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Your Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={onPlayerNameChange}
              className="bg-white/5 border-white/20 focus:border-game-accent text-white"
            />
          </div>
        </div>
        
        <Button 
          className="w-full gradient-button py-5 text-lg mt-4"
          onClick={onJoinMultiplayerGame}
          disabled={!gameId.trim() || !playerName.trim()}
        >
          <Users className="w-5 h-5 mr-2" />
          Join Multiplayer Game
        </Button>
      </div>
    </div>
  );
};

export default JoinMultiplayerTab;
