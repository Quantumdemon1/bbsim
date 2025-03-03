
import React from 'react';
import { PlayerData } from '../../PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import EvictionVoting from '../EvictionVoting';
import Eviction from '../Eviction';

interface EvictionPhaseRendererProps {
  phase: string;
  players: PlayerData[];
  nominees: string[];
  alliances?: Alliance[];
  selectedPlayers: string[];
  statusMessage: string;
  week: number;
  onAction: (action: string, data?: any) => void;
}

const EvictionPhaseRenderer: React.FC<EvictionPhaseRendererProps> = ({
  phase,
  players,
  nominees,
  alliances,
  selectedPlayers,
  statusMessage,
  week,
  onAction
}) => {
  switch (phase) {
    case 'Eviction Voting':
      return (
        <EvictionVoting
          players={players}
          nominees={nominees}
          alliances={alliances || []}
          onAction={onAction}
        />
      );
      
    case 'Eviction':
      return (
        <Eviction
          players={players}
          selectedPlayers={selectedPlayers}
          statusMessage={statusMessage}
          week={week}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

export default EvictionPhaseRenderer;
