
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, UserPlus, Users } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';

const SinglePlayerTab = () => {
  const navigate = useNavigate();
  const { 
    createSinglePlayerGame, 
    isAdmin, 
    loginAsAdmin 
  } = useGameContext();
  
  const handleStartGame = () => {
    const success = createSinglePlayerGame(); // No arguments for normal player
    if (success) {
      navigate('/game');
    }
  };
  
  const handleAdminMode = () => {
    loginAsAdmin();
    const success = createSinglePlayerGame(true); // Use the bypass argument for admin
    if (success) {
      navigate('/game');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              New Game
            </CardTitle>
            <CardDescription>
              Start a new single player game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="default" 
              onClick={handleStartGame}
              className="w-full"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="mr-2 h-5 w-5" />
              Admin Mode
            </CardTitle>
            <CardDescription>
              Start a game with admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={handleAdminMode}
              className="w-full"
              disabled={isAdmin}
            >
              {isAdmin ? "Already in Admin Mode" : "Enter Admin Mode"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SinglePlayerTab;
