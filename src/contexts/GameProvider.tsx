
import React, { ReactNode } from 'react';
import { PlayerManagerProvider } from './PlayerManagerContext';
import { GameStateProvider } from './GameStateContext';
import { AllianceProvider } from './AllianceContext';
import { PowerupProvider } from './PowerupContext';
import { PlayerAuthProvider } from './PlayerAuthContext';
import { mockPlayers } from './types';

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  return (
    <PlayerAuthProvider>
      <PlayerManagerProvider initialPlayers={mockPlayers}>
        <GameStateProvider>
          <AllianceProvider>
            <PowerupProvider>
              {children}
            </PowerupProvider>
          </AllianceProvider>
        </GameStateProvider>
      </PlayerManagerProvider>
    </PlayerAuthProvider>
  );
};
