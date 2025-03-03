
import React, { useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface PhaseProgressTrackerProps {
  currentPhase: string;
  onPhaseComplete: () => void;
  disabled?: boolean;
}

const PhaseProgressTracker: React.FC<PhaseProgressTrackerProps> = ({
  currentPhase,
  onPhaseComplete,
  disabled = false
}) => {
  const { 
    players, 
    markPhaseProgress, 
    getPhaseProgress, 
    currentPlayer,
    phaseCountdown,
    startPhaseCountdown,
    gameMode
  } = useGameContext();
  
  // Get the IDs of all active players (not evicted)
  const activePlayerIds = players
    .filter(p => p.status !== 'evicted')
    .map(p => p.id);
  
  // Get progress for the current phase
  const progress = getPhaseProgress(currentPhase);
  
  // Process the progress data for display
  const processedProgress = React.useMemo(() => {
    if (!progress) {
      return { 
        playersReady: [], 
        completed: false,
        completedCount: 0,
        totalCount: activePlayerIds.length,
        percentage: 0
      };
    }
    
    const completedCount = progress.playersReady.length;
    const totalCount = activePlayerIds.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      ...progress,
      completedCount,
      totalCount,
      percentage,
      hasStartedCountdown: progress.completed && !progress.playersReady.includes('*')
    };
  }, [progress, activePlayerIds]);
  
  // Check if current player has completed this phase
  const isCurrentPlayerComplete = currentPlayer ? 
    processedProgress.playersReady.includes(currentPlayer.id) : 
    false;
  
  // Start countdown if majority has voted but not all
  useEffect(() => {
    if (gameMode === 'multiplayer' && 
        processedProgress.hasStartedCountdown && 
        !processedProgress.completed &&
        phaseCountdown === null) {
      startPhaseCountdown(30);
    }
  }, [processedProgress.hasStartedCountdown, processedProgress.completed, phaseCountdown, gameMode, startPhaseCountdown]);
  
  // If single player or countdown reaches 0, complete the phase
  useEffect(() => {
    if ((gameMode === 'singleplayer' && isCurrentPlayerComplete) || 
        (phaseCountdown === 0)) {
      onPhaseComplete();
    }
  }, [isCurrentPlayerComplete, phaseCountdown, gameMode, onPhaseComplete]);
  
  const handleProceed = () => {
    if (currentPlayer) {
      markPhaseProgress(currentPhase, currentPlayer.id);
      
      // In single player, immediately proceed
      if (gameMode === 'singleplayer') {
        onPhaseComplete();
      }
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-game-dark/90 border-t border-game-accent/30 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">
              {currentPhase}
            </span>
            <span className="text-game-accent text-xs">
              {processedProgress.completedCount} / {processedProgress.totalCount} ready
            </span>
          </div>
          <Progress value={processedProgress.percentage} className="h-2 bg-gray-700">
            <div 
              className="h-full bg-game-accent transition-all duration-500"
              style={{ width: `${processedProgress.percentage}%` }}
            />
          </Progress>
        </div>
        
        <div className="flex items-center space-x-3">
          {phaseCountdown !== null && (
            <div className="flex items-center bg-game-accent/20 px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 mr-2 text-game-accent" />
              <span className="text-game-accent font-mono font-bold">{phaseCountdown}s</span>
            </div>
          )}
          
          <Button
            variant="default"
            className="bg-game-accent hover:bg-game-highlight text-black"
            disabled={disabled || isCurrentPlayerComplete}
            onClick={handleProceed}
          >
            {isCurrentPlayerComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Ready
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Proceed
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhaseProgressTracker;
