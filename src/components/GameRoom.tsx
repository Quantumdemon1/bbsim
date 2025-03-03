
import React from 'react';
import WeekSidebar from './WeekSidebar';
import GamePhaseDisplay from './GamePhaseDisplay';
import { PlayerData } from './PlayerProfile';
import { useGameContext } from '@/contexts/GameContext';
import GamePhaseManager from './game-phases/GamePhaseManager';

interface GameRoomProps {
  players: PlayerData[];
  initialWeek?: number;
}

const GameRoom: React.FC<GameRoomProps> = ({ 
  players: initialPlayers, 
  initialWeek = 1 
}) => {
  const { alliances } = useGameContext();
  
  const gamePhase = GamePhaseManager({
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
      />
    </div>
  );
};

export default GameRoom;
