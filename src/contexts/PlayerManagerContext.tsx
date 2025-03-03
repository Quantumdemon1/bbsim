
import React, { createContext, useContext, ReactNode } from 'react';
import { usePlayerManager } from '@/hooks/usePlayerManager';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlayerManagerContextType {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  updatePlayerAttributes: (playerId: string, attributes: any) => void;
  updatePlayerRelationships: (playerId: string, relationships: any[]) => void;
}

const PlayerManagerContext = createContext<PlayerManagerContextType>({} as PlayerManagerContextType);

export const PlayerManagerProvider = ({ 
  children, 
  initialPlayers 
}: { 
  children: ReactNode;
  initialPlayers: PlayerData[];
}) => {
  const playerManager = usePlayerManager(initialPlayers);

  return (
    <PlayerManagerContext.Provider
      value={{
        ...playerManager
      }}
    >
      {children}
    </PlayerManagerContext.Provider>
  );
};

export const usePlayerManagerContext = () => {
  const context = useContext(PlayerManagerContext);
  if (context === undefined) {
    throw new Error('usePlayerManagerContext must be used within a PlayerManagerProvider');
  }
  return context;
};
