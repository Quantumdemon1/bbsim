
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { ToastProps } from './types';

interface FinaleManagerProps {
  players: PlayerData[];
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  toast: (props: ToastProps) => void;
}

export function useFinaleManager({ 
  players, 
  setFinalists, 
  setJurors, 
  toast 
}: FinaleManagerProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && players.length > 0) {
      setupFinaleParticipants();
      setInitialized(true);
    }
  }, [players, initialized]);

  const setupFinaleParticipants = () => {
    // Get active players (not evicted)
    const activePlayers = players.filter(p => p.status !== 'evicted');
    
    // Get top 2 players as finalists
    const finalistsArray = activePlayers.slice(0, 2).map(p => p.id);
    
    // Get last 7 evicted players (or as many as available) as jurors
    const evictedPlayers = players
      .filter(p => p.status === 'evicted')
      .slice(-7);  // Get the last 7 evicted players
    
    const jurorsArray = evictedPlayers.map(p => p.id);
    
    setFinalists(finalistsArray);
    setJurors(jurorsArray);
    
    toast({
      title: "Finale Set",
      description: `Finalists and jury have been determined. ${finalistsArray.length} finalists and ${jurorsArray.length} jury members.`,
    });
  };

  return {
    setupFinaleParticipants
  };
}
