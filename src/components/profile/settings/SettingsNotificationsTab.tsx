
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Volume2 } from 'lucide-react';
import { PlayerSettings } from '@/hooks/usePlayerAuth';

interface SettingsNotificationsTabProps {
  settings: PlayerSettings;
  updateSetting: <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => void;
}

const SettingsNotificationsTab: React.FC<SettingsNotificationsTabProps> = ({
  settings,
  updateSetting
}) => {
  return (
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
          checked={settings.notifications}
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
          checked={settings.autoDeclineInvites}
          onCheckedChange={(checked) => updateSetting('autoDeclineInvites', checked)}
        />
      </div>
    </div>
  );
};

export default SettingsNotificationsTab;
