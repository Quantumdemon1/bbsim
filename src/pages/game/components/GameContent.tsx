
import React, { Suspense, memo, useMemo } from 'react';
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

// Use memo to prevent unnecessary re-renders with custom equality function
const GameContent = memo(({
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
}: GameContentProps) => {
  // Memoize GameRoom props to prevent unnecessary re-renders
  const gameRoomProps = useMemo(() => ({
    players,
    initialWeek: 1,
    onPhaseChange: handlePhaseChange
  }), [players, handlePhaseChange]);

  // Memoize GameControls props
  const gameControlsProps = useMemo(() => ({
    players,
    dayCount,
    actionsRemaining,
    useAction
  }), [players, dayCount, actionsRemaining, useAction]);

  // Memoize DayTracker props
  const dayTrackerProps = useMemo(() => ({
    dayCount,
    actionsRemaining,
    advanceDay
  }), [dayCount, actionsRemaining, advanceDay]);

  // Memoize AdminPanel props
  const adminPanelProps = useMemo(() => ({
    open: showAdminPanel,
    onOpenChange: onAdminPanelOpenChange
  }), [showAdminPanel, onAdminPanelOpenChange]);

  // Log render in development only to track component rendering
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GameContent rendered with phase:', currentPhase);
    }
  }, [currentPhase]);

  return (
    <>
      <DayTracker {...dayTrackerProps} />
      
      {/* Fixed: AdminPanel is now rendered directly, not inside any unnecessary wrappers */}
      <AdminPanel {...adminPanelProps} />
      
      <Suspense fallback={<LoadingState text="Loading game controls..." />}>
        <GameControls {...gameControlsProps} />
      </Suspense>
      
      <Suspense fallback={<LoadingState text="Loading game room..." />}>
        <GameRoom {...gameRoomProps} />
      </Suspense>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary renders
  return (
    prevProps.currentPhase === nextProps.currentPhase &&
    prevProps.dayCount === nextProps.dayCount &&
    prevProps.actionsRemaining === nextProps.actionsRemaining &&
    prevProps.showAdminPanel === nextProps.showAdminPanel &&
    prevProps.players === nextProps.players
  );
});

// Add display name for better debugging
GameContent.displayName = 'GameContent';

export default GameContent;
