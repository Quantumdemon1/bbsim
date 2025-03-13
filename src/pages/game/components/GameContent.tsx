
import React, { Suspense, memo } from 'react';
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

// Use memo to prevent unnecessary re-renders
const GameContent: React.FC<GameContentProps> = memo(({
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
  // Memoize GameRoom props to prevent unnecessary re-renders
  const gameRoomProps = React.useMemo(() => ({
    players,
    initialWeek: 1,
    onPhaseChange: handlePhaseChange
  }), [players, handlePhaseChange]);

  // Memoize GameControls props
  const gameControlsProps = React.useMemo(() => ({
    players,
    dayCount,
    actionsRemaining,
    useAction
  }), [players, dayCount, actionsRemaining, useAction]);

  // Memoize DayTracker props
  const dayTrackerProps = React.useMemo(() => ({
    dayCount,
    actionsRemaining,
    advanceDay
  }), [dayCount, actionsRemaining, advanceDay]);

  return (
    <>
      <DayTracker {...dayTrackerProps} />
      
      <AdminPanel 
        open={showAdminPanel}
        onOpenChange={onAdminPanelOpenChange}
      />
      
      <Suspense fallback={<LoadingState text="Loading game controls..." />}>
        <GameControls {...gameControlsProps} />
      </Suspense>
      
      <Suspense fallback={<LoadingState text="Loading game room..." />}>
        <GameRoom {...gameRoomProps} />
      </Suspense>
    </>
  );
});

// Add display name for better debugging
GameContent.displayName = 'GameContent';

export default GameContent;
