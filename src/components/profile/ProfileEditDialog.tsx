
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGameContext } from '@/contexts/GameContext';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  player: PlayerData;
  onSave: (updatedProfile: Partial<PlayerData>) => void;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onClose,
  player,
  onSave
}) => {
  const [name, setName] = useState(player.name || '');
  const [bio, setBio] = useState(player.bio || '');
  const [age, setAge] = useState(player.age?.toString() || '');
  const [hometown, setHometown] = useState(player.hometown || '');
  const [occupation, setOccupation] = useState(player.occupation || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (age && (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 100)) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const updatedProfile: Partial<PlayerData> = {
      name,
      bio: bio || undefined,
      age: age ? parseInt(age) : undefined,
      hometown: hometown || undefined,
      occupation: occupation || undefined,
    };
    
    onSave(updatedProfile);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-game-dark text-white border-game-accent">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your player profile information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-game-medium border-game-accent/50"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-game-medium border-game-accent/50 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-game-medium border-game-accent/50"
                min={18}
                max={100}
              />
              {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hometown">Hometown</Label>
              <Input
                id="hometown"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="bg-game-medium border-game-accent/50"
                placeholder="e.g. New York, NY"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="bg-game-medium border-game-accent/50"
              placeholder="e.g. Marketing Executive"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-game-accent text-black hover:bg-game-highlight">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
