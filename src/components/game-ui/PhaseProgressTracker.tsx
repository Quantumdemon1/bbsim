
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/contexts/GameContext';
import { CheckCircle, Clock, User } from 'lucide-react';
import { SinglePhaseProgressInfo } from '@/hooks/gameState/types/phaseProgressTypes';
import { GamePhase } from '@/types/gameTypes';

interface PhaseProgressTrackerProps {
  phase: GamePhase;
  onPhaseComplete?: () => void;
  playersToTrack?: string[]; // Optional prop to track specific players only
}

export const PhaseProgressTracker: React.FC<PhaseProgressTrackerProps> = ({
  phase,
  onPhaseComplete,
  playersToTrack,
}) => {
  const { 
    players, 
    markPhaseProgress,
    getPhaseProgress,
    phaseCountdown,
    currentPlayer,
  } = useGameContext();
  
  const [hasMarkedProgress, setHasMarkedProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the appropriate players to track progress for
  const relevantPlayers = playersToTrack || 
    players?.filter(p => p.isHuman || p.isAdmin).map(p => p.id) || [];
  
  // Get the current phase progress and convert it to SinglePhaseProgressInfo
  const phaseProgressInfo = getPhaseProgress ? getPhaseProgress(phase) : null;
  
  // Create a properly typed progress object or null
  const progress: SinglePhaseProgressInfo | null = phaseProgressInfo ? {
    playersReady: Array.isArray(phaseProgressInfo.playersReady) ? phaseProgressInfo.playersReady : [],
    completed: !!phaseProgressInfo.completed,
    completedCount: typeof phaseProgressInfo.completedCount === 'number' ? phaseProgressInfo.completedCount : 0,
    totalCount: typeof phaseProgressInfo.totalCount === 'number' ? phaseProgressInfo.totalCount : 0,
    percentage: typeof phaseProgressInfo.percentage === 'number' ? phaseProgressInfo.percentage : 0,
    hasStartedCountdown: !!phaseProgressInfo.hasStartedCountdown
  } : null;
  
  // Handle clicking ready
  const handleMarkReady = () => {
    if (!currentPlayer) {
      setError("Cannot mark as ready: No current player found");
      return;
    }
    
    if (hasMarkedProgress) return;
    
    try {
      markPhaseProgress(phase, currentPlayer.id);
      setHasMarkedProgress(true);
      setError(null);
    } catch (err) {
      console.error("Error marking phase progress:", err);
      setError("Failed to mark as ready");
    }
  };
  
  // When the phase is completed, trigger the callback
  useEffect(() => {
    if (progress?.completed && onPhaseComplete) {
      onPhaseComplete();
    }
  }, [progress?.completed, onPhaseComplete]);
  
  // Reset the marked progress state when the phase changes
  useEffect(() => {
    setHasMarkedProgress(false);
    setError(null);
  }, [phase]);
  
  // If there's no progress data, show a simplified version
  if (!progress) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-100 dark:bg-slate-900 p-2 border-t border-slate-300 dark:border-slate-700">
        <Progress value={0} className="h-2" />
        <div className="flex items-center justify-between text-sm mt-1">
          <span>Waiting for players...</span>
          <Button 
            size="sm" 
            onClick={handleMarkReady}
            disabled={!currentPlayer}
          >
            Mark Ready
          </Button>
        </div>
        {error && (
          <div className="text-xs text-red-500 mt-1">{error}</div>
        )}
      </div>
    );
  }
  
  // If the player has already marked themselves as ready
  const isCurrentPlayerReady = currentPlayer ? 
    progress.playersReady.includes(currentPlayer.id) : false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-100 dark:bg-slate-900 p-2 border-t border-slate-300 dark:border-slate-700">
      <Progress value={progress.percentage} className="h-2" />
      <div className="flex items-center justify-between text-sm mt-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{progress.completedCount}/{progress.totalCount} Ready</span>
          
          {progress.hasStartedCountdown && phaseCountdown !== null && (
            <span className="flex items-center text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4 mr-1" />
              {phaseCountdown}s remaining
            </span>
          )}
          
          {progress.completed && (
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" />
              Phase complete!
            </span>
          )}
        </div>
        
        <Button 
          size="sm" 
          onClick={handleMarkReady}
          disabled={isCurrentPlayerReady || !currentPlayer}
          variant={isCurrentPlayerReady ? "secondary" : "default"}
        >
          {isCurrentPlayerReady ? "Ready" : "Mark Ready"}
        </Button>
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
};
