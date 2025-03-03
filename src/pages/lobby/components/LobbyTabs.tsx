
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Shield } from 'lucide-react';
import PlayersTab from './tabs/PlayersTab';
import HouseTab from './tabs/HouseTab';
import AlliancesTab from './tabs/AlliancesTab';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface LobbyTabsProps {
  onPlayerSelect: (player: PlayerData) => void;
}

const LobbyTabs = ({ onPlayerSelect }: LobbyTabsProps) => {
  return (
    <Tabs defaultValue="players" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4 bg-game-dark">
        <TabsTrigger value="players" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
          <Users className="mr-2 h-4 w-4" />
          Players
        </TabsTrigger>
        <TabsTrigger value="house" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
          <Home className="mr-2 h-4 w-4" />
          House
        </TabsTrigger>
        <TabsTrigger value="alliances" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
          <Shield className="mr-2 h-4 w-4" />
          Alliances
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="players">
        <PlayersTab onPlayerSelect={onPlayerSelect} />
      </TabsContent>
      
      <TabsContent value="house">
        <HouseTab />
      </TabsContent>
      
      <TabsContent value="alliances">
        <AlliancesTab />
      </TabsContent>
    </Tabs>
  );
};

export default LobbyTabs;
