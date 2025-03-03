
import React from 'react';
import WeekSidebar from './WeekSidebar';
import GamePhaseDisplay from './GamePhaseDisplay';
import { PlayerData } from './PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { useGamePhaseManager } from '@/hooks/game-phases/useGamePhaseManager';

interface GameRoomProps {
  players: PlayerData[];
  initialWeek?: number;
  onPhaseChange?: (phase: string) => void;
}

const GameRoom: React.FC<GameRoomProps> = ({ 
  players: initialPlayers, 
  initialWeek = 1,
  onPhaseChange
}) => {
  const { alliances, markPhaseProgress, clearPhaseProgress } = useGameContext();
  
  // Use the hook correctly to get the game phase state and functions
  const gamePhase = useGamePhaseManager({
    players: initialPlayers,
    week: initialWeek
  });
  
  const phases = [
    'HoH Competition',
    'Nomination Ceremony',
    'PoV Competition',
    'Veto Ceremony',
    'Eviction Voting',
    'Eviction',
    'Weekly Summary',
    'Special Competition'
  ];

  const handleWeekChange = (newWeek: number) => {
    gamePhase.setWeek(newWeek);
    gamePhase.setPhase('HoH Competition');
    if (onPhaseChange) onPhaseChange('HoH Competition');
    
    // Clear any phase progress when changing weeks
    if (clearPhaseProgress) {
      clearPhaseProgress('*');
    }
  };

  const handlePhaseChange = (newPhase: string) => {
    gamePhase.setPhase(newPhase);
    if (onPhaseChange) onPhaseChange(newPhase);
    
    // Clear the previous phase progress when changing phases
    if (clearPhaseProgress) {
      clearPhaseProgress(gamePhase.phase);
    }
  };

  // Update parent component when phase changes
  React.useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(gamePhase.phase);
    }
  }, [gamePhase.phase, onPhaseChange]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <WeekSidebar 
        currentWeek={gamePhase.week} 
        onWeekChange={handleWeekChange} 
        phases={phases}
        activePhase={gamePhase.phase}
        onPhaseChange={handlePhaseChange}
      />
      
      <GamePhaseDisplay 
        phase={gamePhase.phase}
        week={gamePhase.week}
        players={gamePhase.players}
        nominees={gamePhase.nominees}
        hoh={gamePhase.hoh}
        veto={gamePhase.veto}
        vetoUsed={gamePhase.vetoUsed || false} // Provide default value
        lastHoH={gamePhase.lastHoH || null} // Provide default value
        onAction={gamePhase.handleAction}
        statusMessage={gamePhase.statusMessage}
        selectedPlayers={gamePhase.selectedPlayers}
        onPlayerSelect={gamePhase.handlePlayerSelect}
        alliances={alliances}
        finalists={gamePhase.finalists}
        jurors={gamePhase.jurors}
        votes={gamePhase.votes}
        weekSummaries={gamePhase.weekSummaries}
      />
    </div>
  );
};

export default GameRoom;
