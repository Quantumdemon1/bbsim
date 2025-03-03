
import { useState } from 'react';

type PhaseProgress = {
  [phase: string]: {
    playersReady: string[];
    completed: boolean;
  }
};

interface PhaseProgressProps {
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayerCount: number;
}

export function usePhaseProgress({ gameMode, humanPlayerCount }: PhaseProgressProps) {
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress>({});
  const [phaseCountdown, setPhaseCountdown] = useState<number | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);
  
  const markPhaseProgress = (phase: string, playerId: string) => {
    setPhaseProgress(prev => {
      const phaseObj = prev[phase] || { playersReady: [], completed: false };
      
      if (!phaseObj.playersReady.includes(playerId)) {
        const updatedPlayersReady = [...phaseObj.playersReady, playerId];
        
        const isCompleted = gameMode === 'singleplayer' || 
                           (updatedPlayersReady.length >= Math.ceil(humanPlayerCount / 2));
        
        if (isCompleted && gameMode === 'multiplayer' && !phaseObj.completed) {
          startPhaseCountdown(30);
        }
        
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
  
  const getPhaseProgress = (phase: string) => {
    const progressData = phaseProgress[phase] || { playersReady: [], completed: false };
    
    return {
      ...progressData,
      completedCount: progressData.playersReady.length,
      totalCount: humanPlayerCount,
      percentage: humanPlayerCount > 0 
        ? (progressData.playersReady.length / humanPlayerCount) * 100 
        : 0,
      hasStartedCountdown: phaseCountdown !== null && progressData.completed
    };
  };
  
  const clearPhaseProgress = (phase: string) => {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    setPhaseCountdown(null);
    
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
  
  const startPhaseCountdown = (seconds: number) => {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
    }
    
    setPhaseCountdown(seconds);
    
    const interval = window.setInterval(() => {
      setPhaseCountdown(prev => {
        if (prev === null || prev <= 1) {
          window.clearInterval(interval);
          setCountdownInterval(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  return {
    phaseProgress,
    phaseCountdown,
    markPhaseProgress,
    getPhaseProgress,
    startPhaseCountdown,
    clearPhaseProgress
  };
}
