
import React, { ReactNode } from 'react';
import { PlayerManagerProvider } from './PlayerManagerContext';
import { GameStateProvider } from './GameStateContext';
import { AllianceProvider } from './AllianceContext';
import { PowerupProvider } from './PowerupContext';
import { PlayerAuthProvider } from './PlayerAuthContext';
import { AIPlayerProvider } from './AIPlayerContext';
import { mockPlayers } from './types';

interface GameProviderProps {
  children: ReactNode;
}

/**
 * Main provider component that wraps all game-related context providers
 * Establishes the proper dependency order for nested contexts
 */
export const GameProvider = ({ children }: GameProviderProps) => {
  return (
    <PlayerAuthProvider>
      <PlayerManagerProvider initialPlayers={mockPlayers}>
        <GameStateProvider>
          <AllianceProvider>
            <PowerupProvider>
              <AIPlayerProvider>
                {children}
              </AIPlayerProvider>
            </PowerupProvider>
          </AllianceProvider>
        </GameStateProvider>
      </PlayerManagerProvider>
    </PlayerAuthProvider>
  );
};
