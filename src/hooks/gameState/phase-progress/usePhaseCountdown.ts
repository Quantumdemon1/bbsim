
import { useState } from 'react';

export function usePhaseCountdown() {
  const [phaseCountdown, setPhaseCountdown] = useState<number | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);
  
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
  
  const clearCountdown = () => {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    setPhaseCountdown(null);
  };

  return {
    phaseCountdown,
    startPhaseCountdown,
    clearCountdown
  };
}
