
import React, { createContext, useContext, ReactNode } from 'react';
import { useAllianceManager } from './allianceManager';
import { usePlayerManagerContext } from './PlayerManagerContext';
import { Alliance } from './types';

interface AllianceContextType {
  alliances: Alliance[];
  setAlliances: (alliances: Alliance[]) => void;
  createAlliance: (name: string, members: string[]) => void;
  addToAlliance: (allianceId: string, playerId: string) => void;
  removeFromAlliance: (allianceId: string, playerId: string) => void;
}

const AllianceContext = createContext<AllianceContextType>({} as AllianceContextType);

export const AllianceProvider = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  const allianceManager = useAllianceManager(players, setPlayers);

  return (
    <AllianceContext.Provider
      value={{
        ...allianceManager
      }}
    >
      {children}
    </AllianceContext.Provider>
  );
};

export const useAllianceContext = () => {
  const context = useContext(AllianceContext);
  if (context === undefined) {
    throw new Error('useAllianceContext must be used within an AllianceProvider');
  }
  return context;
};
