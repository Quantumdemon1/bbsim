
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayerSettings } from '@/hooks/usePlayerAuth';

interface SettingsPrivacyTabProps {
  settings: PlayerSettings;
  updateSetting: <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => void;
}

const SettingsPrivacyTab: React.FC<SettingsPrivacyTabProps> = ({
  settings,
  updateSetting
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Profile Visibility</Label>
        <RadioGroup 
          value={settings.privacy} 
          onValueChange={(value) => updateSetting('privacy', value as 'public' | 'friends' | 'private')}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" className="border-game-accent text-game-accent" />
            <Label htmlFor="public" className="font-normal">Public - Anyone can view your profile</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friends" id="friends" className="border-game-accent text-game-accent" />
            <Label htmlFor="friends" className="font-normal">Friends Only - Only friends can view details</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" className="border-game-accent text-game-accent" />
            <Label htmlFor="private" className="font-normal">Private - Hide most information</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default SettingsPrivacyTab;
