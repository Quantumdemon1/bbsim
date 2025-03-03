
import { createContext, useContext } from 'react';
import { GameContextType } from './types';

export const GameContext = createContext<GameContextType>({} as GameContextType);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
