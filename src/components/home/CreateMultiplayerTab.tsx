
import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateMultiplayerTabProps {
  hostName: string;
  onHostNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateMultiplayerGame: () => void;
}

const CreateMultiplayerTab: React.FC<CreateMultiplayerTabProps> = ({ 
  hostName, 
  onHostNameChange, 
  onCreateMultiplayerGame 
}) => {
  return (
    <div className="space-y-4 mt-4">
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
            onChange={onHostNameChange}
            className="bg-white/5 border-white/20 focus:border-game-accent text-white"
          />
        </div>
        
        <Button 
          className="w-full gradient-button py-5 text-lg mt-4"
          onClick={onCreateMultiplayerGame}
          disabled={!hostName.trim()}
        >
          <Crown className="w-5 h-5 mr-2" />
          Create Multiplayer Game
        </Button>
      </div>
    </div>
  );
};

export default CreateMultiplayerTab;
