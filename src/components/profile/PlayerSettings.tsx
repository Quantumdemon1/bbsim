
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Settings } from 'lucide-react';
import { Tabs } from "@/components/ui/tabs";
import { PlayerSettings as PlayerSettingsType } from '@/hooks/usePlayerAuth';
import SettingsTabsList from './settings/SettingsTabsList';
import SettingsTabsContent from './settings/SettingsTabsContent';
import SettingsFooter from './settings/SettingsFooter';

interface PlayerSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: PlayerSettingsType;
  onSave: (settings: Partial<PlayerSettingsType>) => void;
}

const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  open,
  onClose,
  settings,
  onSave
}) => {
  const [newSettings, setNewSettings] = useState<PlayerSettingsType>({...settings});
  
  const handleSave = () => {
    onSave(newSettings);
    onClose();
  };
  
  const updateSetting = <K extends keyof PlayerSettingsType>(
    key: K, 
    value: PlayerSettingsType[K]
  ) => {
    setNewSettings({ ...newSettings, [key]: value });
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-game-accent" />
            Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your game experience
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <SettingsTabsList />
          <SettingsTabsContent 
            settings={newSettings} 
            updateSetting={updateSetting} 
          />
        </Tabs>
        
        <SettingsFooter 
          onSave={handleSave} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSettings;
