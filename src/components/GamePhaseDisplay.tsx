
import React from 'react';
import { PlayerData } from './PlayerProfile';
import { Alliance } from '@/contexts/types';
import HoHCompetition from './game-phases/HoHCompetition';
import NominationCeremony from './game-phases/NominationCeremony';
import PoVCompetition from './game-phases/PoVCompetition';
import VetoCeremony from './game-phases/VetoCeremony';
import EvictionVoting from './game-phases/EvictionVoting';
import Eviction from './game-phases/Eviction';
import SpecialCompetition from './game-phases/SpecialCompetition';
import DefaultPhase from './game-phases/DefaultPhase';

interface GamePhaseDisplayProps {
  phase: string;
  week: number;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  onAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  alliances?: Alliance[];
}

const GamePhaseDisplay: React.FC<GamePhaseDisplayProps> = ({
  phase,
  week,
  players,
  nominees,
  hoh,
  veto,
  onAction,
  statusMessage,
  selectedPlayers,
  onPlayerSelect,
  alliances = []
}) => {
  const renderPhaseContent = () => {
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
        
      case 'PoV Competition':
        return (
          <PoVCompetition
            players={players}
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
        
      case 'Eviction Voting':
        return (
          <EvictionVoting
            players={players}
            nominees={nominees}
            alliances={alliances}
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
        return (
          <DefaultPhase
            phase={phase}
            statusMessage={statusMessage}
          />
        );
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderPhaseContent()}
    </div>
  );
};

export default GamePhaseDisplay;
