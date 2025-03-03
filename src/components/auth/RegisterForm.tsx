
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Key, User } from 'lucide-react';
import { PlayerData } from '../PlayerProfileTypes';

interface RegisterFormProps {
  onRegister: (playerData: PlayerData) => void;
  setError: (error: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [hometown, setHometown] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="register-username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
            placeholder="Your username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            placeholder="Your password"
          />
        </div>
      </div>

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

      <Button type="submit" className="w-full">
        <UserPlus className="w-4 h-4 mr-2" />
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
