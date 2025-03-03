
import React, { createContext, useContext, ReactNode } from 'react';
import { usePowerupManager } from './powerupManager';
import { usePlayerManagerContext } from './PlayerManagerContext';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PowerupContextType {
  awardPowerup: (playerId: string, powerup: PlayerData['powerup']) => void;
  usePowerup: (playerId: string) => void;
}

const PowerupContext = createContext<PowerupContextType>({} as PowerupContextType);

export const PowerupProvider = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  const powerupManager = usePowerupManager(players, setPlayers);

  return (
    <PowerupContext.Provider
      value={{
        ...powerupManager
      }}
    >
      {children}
    </PowerupContext.Provider>
  );
};

export const usePowerupContext = () => {
  const context = useContext(PowerupContext);
  if (context === undefined) {
    throw new Error('usePowerupContext must be used within a PowerupProvider');
  }
  return context;
};
