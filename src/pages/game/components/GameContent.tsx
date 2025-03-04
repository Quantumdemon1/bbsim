
import React, { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading-state';
import GameControls from './GameControls';
import AdminPanel from './AdminPanel';
import GameRoom from '@/components/GameRoom';
import DayTracker from './DayTracker';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameContentProps {
  players: PlayerData[];
  dayCount: number;
  actionsRemaining: number;
  currentPhase: GamePhase;
  showAdminPanel: boolean;
  onAdminPanelOpenChange: (open: boolean) => void;
  advanceDay: () => void;
  useAction: () => boolean;
  handlePhaseChange: (phase: string) => void;
  handlePhaseComplete: () => void;
}

const GameContent: React.FC<GameContentProps> = ({
  players,
  dayCount,
  actionsRemaining,
  currentPhase,
  showAdminPanel,
  onAdminPanelOpenChange,
  advanceDay,
  useAction,
  handlePhaseChange,
  handlePhaseComplete
}) => {
  return (
    <>
      <DayTracker 
        dayCount={dayCount} 
        actionsRemaining={actionsRemaining} 
        advanceDay={advanceDay} 
      />
      
      <AdminPanel 
        open={showAdminPanel}
        onOpenChange={onAdminPanelOpenChange}
      />
      
      <Suspense fallback={<LoadingState text="Loading game controls..." />}>
        <GameControls 
          players={players} 
          dayCount={dayCount}
          actionsRemaining={actionsRemaining}
          useAction={useAction}
        />
      </Suspense>
      
      <Suspense fallback={<LoadingState text="Loading game room..." />}>
        <GameRoom 
          players={players} 
          initialWeek={1} 
          onPhaseChange={handlePhaseChange} 
        />
      </Suspense>
    </>
  );
};

export default GameContent;
