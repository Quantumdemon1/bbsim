
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, Key, User } from 'lucide-react';
import { PlayerData } from '../PlayerProfileTypes';

interface LoginFormProps {
  onLogin: (playerData: PlayerData) => void;
  setError: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    // In a real app, we would verify credentials
    // For now, just create a player with the username
    const player: PlayerData = {
      id: `user-${Date.now()}`, // Generate temporary ID
      name: username,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    onLogin(player);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
            placeholder="Your username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            placeholder="Your password"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
