
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SinglePlayerTabProps {
  isAuthenticated: boolean;
  isGuest: boolean;
  onStartSinglePlayer: () => void;
}

const SinglePlayerTab: React.FC<SinglePlayerTabProps> = ({ 
  isAuthenticated, 
  isGuest, 
  onStartSinglePlayer 
}) => {
  return (
    <div className="space-y-4 mt-4">
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
        
        <Button 
          className="w-full gradient-button py-5 text-lg mt-4"
          onClick={onStartSinglePlayer}
          disabled={!isAuthenticated || isGuest}
        >
          <Bot className="w-5 h-5 mr-2" />
          Start Single Player
        </Button>
      </div>
    </div>
  );
};

export default SinglePlayerTab;
