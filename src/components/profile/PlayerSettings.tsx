
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Lock, Eye, Moon, Volume2 } from 'lucide-react';
import { PlayerSettings as PlayerSettingsType } from '@/hooks/usePlayerAuth';

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
          <TabsList className="grid grid-cols-3 bg-game-medium">
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-game-accent data-[state=active]:text-black"
            >
              <Eye className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-game-accent data-[state=active]:text-black"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-game-accent data-[state=active]:text-black"
            >
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="mt-4 space-y-4">
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
                  checked={newSettings.theme === 'dark'}
                  onCheckedChange={(checked) => updateSetting('theme', checked ? 'dark' : 'light')}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-gray-400" />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <p className="text-xs text-gray-400">Receive game alerts and messages</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={newSettings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2 text-gray-400" />
                    <Label htmlFor="auto-decline">Auto-Decline Game Invites</Label>
                  </div>
                  <p className="text-xs text-gray-400">Automatically decline game invitations</p>
                </div>
                <Switch 
                  id="auto-decline"
                  checked={newSettings.autoDeclineInvites}
                  onCheckedChange={(checked) => updateSetting('autoDeclineInvites', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <RadioGroup 
                  value={newSettings.privacy} 
                  onValueChange={(value) => updateSetting('privacy', value as any)}
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
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-game-accent text-black hover:bg-game-highlight">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSettings;
