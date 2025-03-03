
import React from 'react';
import { User, Bot, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { createSinglePlayerGame, loginAsAdmin } = useGameContext();

  // Special admin bypass function to test single player without registration
  const handleAdminBypass = () => {
    // Login as admin first, then create the game
    loginAsAdmin();
    if (createSinglePlayerGame(true)) { // Pass true to bypass auth check
      navigate('/game');
    }
  };

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

        {/* Admin bypass link */}
        <div className="mt-3 text-right">
          <button 
            onClick={handleAdminBypass}
            className="text-xs text-gray-400 hover:text-game-accent flex items-center justify-end ml-auto"
          >
            <Settings className="w-3 h-3 mr-1" />
            Admin Test Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerTab;
