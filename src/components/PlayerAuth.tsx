
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus, Key } from 'lucide-react';
import { PlayerData } from './PlayerProfileTypes';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [hometown, setHometown] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const newPlayer: PlayerData = {
        id: `user-${Date.now()}`, // Generate temporary ID
        name: username,
        bio: bio || undefined,
        age: age ? parseInt(age) : undefined,
        hometown: hometown || undefined,
        occupation: occupation || undefined,
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };

      onRegister(newPlayer);
    } else {
      // In a real app, we would verify credentials
      // For now, just create a player with the username
      const player: PlayerData = {
        id: `user-${Date.now()}`, // Generate temporary ID
        name: username,
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };
      
      onLogin(player);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activeTab === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {activeTab === 'login' 
              ? 'Sign in to access your player profile.' 
              : 'Create a new profile to join the game as a contestant.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex mb-4">
          <Button
            variant={activeTab === 'login' ? 'default' : 'outline'}
            className={`flex-1 rounded-r-none ${activeTab === 'login' ? 'bg-game-accent' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
          <Button
            variant={activeTab === 'register' ? 'default' : 'outline'}
            className={`flex-1 rounded-l-none ${activeTab === 'register' ? 'bg-game-accent' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

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

          {activeTab === 'register' && (
            <>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio (Optional)
                </label>
                <Input
                  id="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age (Optional)
                  </label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="hometown" className="text-sm font-medium">
                    Hometown (Optional)
                  </label>
                  <Input
                    id="hometown"
                    type="text"
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    placeholder="Your hometown"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="occupation" className="text-sm font-medium">
                  Occupation (Optional)
                </label>
                <Input
                  id="occupation"
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Your occupation"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {activeTab === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerAuth;
