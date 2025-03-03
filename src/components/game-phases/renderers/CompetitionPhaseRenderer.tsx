
import React from 'react';
import { PlayerData } from '../../PlayerProfileTypes';
import HoHCompetition from '../HoHCompetition';
import PoVCompetition from '../PoVCompetition';
import SpecialCompetition from '../SpecialCompetition';

interface CompetitionPhaseRendererProps {
  phase: string;
  players: PlayerData[];
  hoh: string | null;
  nominees: string[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string, data?: any) => void;
}

const CompetitionPhaseRenderer: React.FC<CompetitionPhaseRendererProps> = ({
  phase,
  players,
  hoh,
  nominees,
  selectedPlayers,
  onPlayerSelect,
  onAction
}) => {
  switch (phase) {
    case 'HoH Competition':
      return (
        <HoHCompetition 
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    case 'PoV Competition':
      return (
        <PoVCompetition
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
          hoh={hoh}
          nominees={nominees}
        />
      );
      
    case 'Special Competition':
      return (
        <SpecialCompetition
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

export default CompetitionPhaseRenderer;
