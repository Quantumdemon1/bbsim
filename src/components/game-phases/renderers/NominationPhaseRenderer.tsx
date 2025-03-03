
import React from 'react';
import { PlayerData } from '../../PlayerProfileTypes';
import NominationCeremony from '../NominationCeremony';
import VetoCeremony from '../VetoCeremony';

interface NominationPhaseRendererProps {
  phase: string;
  players: PlayerData[];
  hoh: string | null;
  nominees: string[];
  veto: string | null;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string, data?: any) => void;
}

const NominationPhaseRenderer: React.FC<NominationPhaseRendererProps> = ({
  phase,
  players,
  hoh,
  nominees,
  veto,
  selectedPlayers,
  onPlayerSelect,
  onAction
}) => {
  switch (phase) {
    case 'Nomination Ceremony':
      return (
        <NominationCeremony
          players={players}
          hoh={hoh}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    case 'Veto Ceremony':
      return (
        <VetoCeremony
          players={players}
          veto={veto}
          nominees={nominees}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

export default NominationPhaseRenderer;
