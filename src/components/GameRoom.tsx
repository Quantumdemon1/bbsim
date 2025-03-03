
import React from 'react';
import WeekSidebar from './WeekSidebar';
import GamePhaseDisplay from './GamePhaseDisplay';
import { PlayerData } from './PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { useGamePhaseManager } from './game-phases/GamePhaseManager';

interface GameRoomProps {
  players: PlayerData[];
  initialWeek?: number;
}

const GameRoom: React.FC<GameRoomProps> = ({ 
  players: initialPlayers, 
  initialWeek = 1 
}) => {
  const { alliances } = useGameContext();
  
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
  };

  const handlePhaseChange = (newPhase: string) => {
    gamePhase.setPhase(newPhase);
  };

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
