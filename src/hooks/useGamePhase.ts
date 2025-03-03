
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfile';
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '@/contexts/GameContext';
import { useHoHPhase } from './game-phases/useHoHPhase';
import { useNominationPhase } from './game-phases/useNominationPhase';
import { usePoVPhase } from './game-phases/usePoVPhase';
import { useVetoPhase } from './game-phases/useVetoPhase';
import { useEvictionPhase } from './game-phases/useEvictionPhase';
import { useSpecialCompetitionPhase } from './game-phases/useSpecialCompetitionPhase';

interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}

export function useGamePhaseManager({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}: GamePhaseProps) {
  const [week, setWeek] = useState(initialWeek);
  const [players, setPlayers] = useState(initialPlayers);
  const [phase, setPhase] = useState(initialPhase);
  const [hoh, setHoH] = useState<string | null>(null);
  const [veto, setVeto] = useState<string | null>(null);
  const [nominees, setNominees] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();
  const { alliances, usePowerup } = useGameContext();

  // Player selection handler (reused across phases)
  const handlePlayerSelect = (playerId: string) => {
    if (phase === 'Nomination Ceremony') {
      // For nominations, allow selecting up to 2 players
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      } else if (selectedPlayers.length < 2) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    } else {
      // For other phases, select only one player
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers([]);
      } else {
        setSelectedPlayers([playerId]);
      }
    }
  };

  // Import the phase-specific logic
  const hohPhase = useHoHPhase({
    players,
    setPlayers,
    selectedPlayers,
    setHoH,
    setStatusMessage,
    setPhase,
    setSelectedPlayers,
    toast
  });

  const nominationPhase = useNominationPhase({
    players,
    setPlayers,
    selectedPlayers,
    setNominees,
    hoh,
    setStatusMessage,
    setPhase,
    setSelectedPlayers,
    usePowerup,
    toast
  });

  const povPhase = usePoVPhase({
    players,
    setPlayers,
    selectedPlayers,
    setVeto,
    setStatusMessage,
    setPhase,
    setSelectedPlayers,
    toast
  });

  const vetoPhase = useVetoPhase({
    players,
    setPlayers,
    nominees,
    setNominees,
    veto,
    hoh,
    setStatusMessage,
    setPhase,
    setSelectedPlayers,
    usePowerup,
    toast
  });

  const evictionPhase = useEvictionPhase({
    players,
    setPlayers,
    nominees,
    setSelectedPlayers,
    setStatusMessage,
    setPhase,
    usePowerup,
    toast
  });

  const specialCompPhase = useSpecialCompetitionPhase({
    players,
    setPlayers,
    selectedPlayers,
    week,
    setWeek,
    setPhase,
    setSelectedPlayers,
    setStatusMessage,
    toast
  });

  // Main action handler that routes to the appropriate phase handler
  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'selectHOH':
        hohPhase.handleSelectHoH();
        break;
        
      case 'nominate':
        nominationPhase.handleNominate();
        break;
        
      case 'selectVeto':
        povPhase.handleSelectVeto();
        break;
        
      case 'vetoAction':
        vetoPhase.handleVetoAction(data);
        break;
        
      case 'evict':
        evictionPhase.handleEvict(data);
        break;
        
      case 'nextWeek':
        // Check if we should have a special competition
        const hasSpecialComp = week % 3 === 0 || Math.random() < 0.2; // Every 3rd week or 20% chance
        
        if (hasSpecialComp) {
          // Reset player statuses except for evicted players
          setPlayers(players.map(player => ({
            ...player,
            status: player.status === 'evicted' ? 'evicted' : undefined
          })));
          
          setHoH(null);
          setVeto(null);
          setNominees([]);
          setSelectedPlayers([]);
          setPhase('Special Competition');
          
          toast({
            title: "Special Competition",
            description: "A special competition is taking place!",
          });
        } else {
          // Reset game state for next week
          setWeek(week + 1);
          setPhase('HoH Competition');
          setHoH(null);
          setVeto(null);
          setNominees([]);
          setSelectedPlayers([]);
          setStatusMessage('');
          
          // Reset player statuses except for evicted players
          setPlayers(players.map(player => ({
            ...player,
            status: player.status === 'evicted' ? 'evicted' : undefined
          })));
          
          toast({
            title: `Week ${week + 1}`,
            description: `Starting week ${week + 1}`,
          });
        }
        break;
        
      case 'specialCompetition':
        specialCompPhase.handleSpecialCompetition();
        break;
    }
  };

  return {
    week,
    phase,
    players,
    nominees,
    hoh,
    veto,
    statusMessage,
    selectedPlayers,
    handlePlayerSelect,
    handleAction,
    setWeek,
    setPhase
  };
}

export default useGamePhaseManager;
