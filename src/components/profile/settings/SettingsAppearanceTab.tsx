
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon } from 'lucide-react';
import { PlayerSettings } from '@/hooks/usePlayerAuth';

interface SettingsAppearanceTabProps {
  settings: PlayerSettings;
  updateSetting: <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => void;
}

const SettingsAppearanceTab: React.FC<SettingsAppearanceTabProps> = ({
  settings,
  updateSetting
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center">
            <Moon className="h-4 w-4 mr-2 text-gray-400" />
            <Label htmlFor="theme">Dark Mode</Label>
          </div>
          <p className="text-xs text-gray-400">Switch between light and dark theme</p>
        </div>
        <Switch 
          id="theme"
          checked={settings.theme === 'dark'}
          onCheckedChange={(checked) => updateSetting('theme', checked ? 'dark' : 'light')}
        />
      </div>
    </div>
  );
};

export default SettingsAppearanceTab;
