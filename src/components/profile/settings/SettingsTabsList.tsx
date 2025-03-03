
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Bell, Lock } from 'lucide-react';

const SettingsTabsList: React.FC = () => {
  return (
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
  );
};

export default SettingsTabsList;
