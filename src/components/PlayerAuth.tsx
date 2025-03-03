
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayerData } from './PlayerProfileTypes';
import AuthTabs from './auth/AuthTabs';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ErrorDisplay from './auth/ErrorDisplay';

interface PlayerAuthProps {
  open: boolean;
  onClose: () => void;
  onLogin: (playerData: PlayerData) => void;
  onRegister: (playerData: PlayerData) => void;
}

const PlayerAuth: React.FC<PlayerAuthProps> = ({ 
  open, 
  onClose, 
  onLogin, 
  onRegister 
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  const handleLogin = (playerData: PlayerData) => {
    onLogin(playerData);
    onClose();
  };

  const handleRegister = (playerData: PlayerData) => {
    onRegister(playerData);
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activeTab === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {activeTab === 'login' 
              ? 'Sign in to access your player profile.' 
              : 'Create a new profile to join the game as a contestant.'}
          </DialogDescription>
        </DialogHeader>

        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <ErrorDisplay error={error} />

        {activeTab === 'login' ? (
          <LoginForm onLogin={handleLogin} setError={setError} />
        ) : (
          <RegisterForm onRegister={handleRegister} setError={setError} />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerAuth;
