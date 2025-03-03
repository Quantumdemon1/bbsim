
import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  isAuthenticated: boolean;
  onClick: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isAuthenticated, onClick }) => {
  return (
    <Button 
      variant="outline" 
      className="flex-1 bg-game-dark/40 border-white/20 text-white/90 hover:bg-game-light/20"
      onClick={onClick}
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
  );
};

export default AuthButton;
