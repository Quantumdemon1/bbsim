
import { useState } from 'react';
import { PhaseProgressInfo, SinglePhaseProgressInfo } from '../types/phaseProgressTypes';

export function usePhaseTracker() {
  const [phaseProgress, setPhaseProgress] = useState<Record<string, { playersReady: string[], completed: boolean }>>({});

  const markPhaseProgress = (phase: string, playerId: string, gameMode: 'singleplayer' | 'multiplayer' | null, humanPlayerCount: number) => {
    setPhaseProgress(prev => {
      const phaseObj = prev[phase] || { playersReady: [], completed: false };
      
      if (!phaseObj.playersReady.includes(playerId)) {
        const updatedPlayersReady = [...phaseObj.playersReady, playerId];
        
        const isCompleted = gameMode === 'singleplayer' || 
                           (updatedPlayersReady.length >= Math.ceil(humanPlayerCount / 2));
        
        return {
          ...prev,
          [phase]: {
            playersReady: updatedPlayersReady,
            completed: isCompleted
          }
        };
      }
      
      return prev;
    });
  };
  
  const getPhaseProgress = (phase: string, humanPlayerCount: number): SinglePhaseProgressInfo => {
    const progressData = phaseProgress[phase] || { playersReady: [], completed: false };
    
    return {
      ...progressData,
      completedCount: progressData.playersReady.length,
      totalCount: humanPlayerCount,
      percentage: humanPlayerCount > 0 
        ? (progressData.playersReady.length / humanPlayerCount) * 100 
        : 0,
      hasStartedCountdown: false // This will be set by the countdown hook
    };
  };
  
  const clearPhaseProgress = (phase: string) => {
    if (phase === '*') {
      setPhaseProgress({});
      return;
    }
    
    setPhaseProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[phase];
      return newProgress;
    });
  };

  return {
    phaseProgress,
    markPhaseProgress,
    getPhaseProgress,
    clearPhaseProgress
  };
}
