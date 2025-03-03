
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '@/contexts/GameContext';
import { useHoHPhase } from './game-phases/useHoHPhase';
import { useNominationPhase } from './game-phases/useNominationPhase';
import { usePoVPhase } from './game-phases/usePoVPhase';
import { useVetoPhase } from './game-phases/useVetoPhase';
import { useEvictionPhase } from './game-phases/useEvictionPhase';
import { useSpecialCompetitionPhase } from './game-phases/useSpecialCompetitionPhase';
import { useJuryQuestionsPhase } from './game-phases/useJuryQuestionsPhase';
import { useJuryVotingPhase } from './game-phases/useJuryVotingPhase';
import { usePlayerSelection } from './game-phases/usePlayerSelection';
import { useGameActions } from './game-phases/useGameActions';
import { GamePhaseProps } from './game-phases/types';

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
  const [finalists, setFinalists] = useState<string[]>([]);
  const [jurors, setJurors] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { usePowerup } = useGameContext();

  // Game state object - shared with all hooks
  const gameState = {
    week,
    phase,
    players,
    nominees,
    hoh,
    veto,
    statusMessage,
    selectedPlayers,
    finalists,
    jurors,
    votes
  };

  // Import the player selection logic
  const playerSelection = usePlayerSelection({
    selectedPlayers,
    setSelectedPlayers,
    phase
  });

  // Import the game actions logic
  const gameActions = useGameActions({
    state: gameState,
    setPlayers,
    setWeek,
    setPhase,
    setHoH,
    setVeto,
    setNominees,
    setSelectedPlayers,
    setStatusMessage,
    usePowerup,
    toast
  });

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
  
  const juryQuestionsPhase = useJuryQuestionsPhase({
    players,
    setPlayers,
    finalists,
    setFinalists,
    jurors,
    setJurors,
    setStatusMessage,
    setPhase,
    setSelectedPlayers
  });

  const juryVotingPhase = useJuryVotingPhase({
    players,
    setPlayers,
    finalists,
    votes,
    setVotes,
    setStatusMessage,
    setPhase,
    setSelectedPlayers
  });

  // Set up finalists and jury for finale
  const setupFinale = () => {
    // For demo purposes, let's just select the first 2 players as finalists and the next 7 as jury
    const activePlayers = players.filter(p => p.status !== 'evicted');
    const finalist1 = activePlayers[0]?.id;
    const finalist2 = activePlayers[1]?.id;
    
    if (finalist1 && finalist2) {
      setFinalists([finalist1, finalist2]);
      
      // Set jury members as evicted players, or random active players if not enough evicted
      const evictedPlayers = players.filter(p => p.status === 'evicted');
      let juryMembers = evictedPlayers.slice(0, 7).map(p => p.id);
      
      // If we don't have enough evicted players, add some active players
      if (juryMembers.length < 3) {
        const remainingPlayers = activePlayers.slice(2).map(p => p.id);
        juryMembers = [...juryMembers, ...remainingPlayers.slice(0, 7 - juryMembers.length)];
      }
      
      setJurors(juryMembers);
    }
    
    toast({
      title: "Finale Setup",
      description: "Finalists and jury members have been selected"
    });
  };

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
        gameActions.handleNextWeek();
        break;
        
      case 'specialCompetition':
        specialCompPhase.handleSpecialCompetition();
        break;
        
      case 'setupFinale':
        setupFinale();
        break;
        
      case 'juryQuestions':
        juryQuestionsPhase.handleJuryQuestions();
        break;
        
      case 'proceedToVoting':
        juryQuestionsPhase.handleProceedToVoting();
        break;
        
      case 'juryVote':
        if (data && data.jurorId && data.finalistId) {
          juryVotingPhase.handleJuryVote(data.jurorId, data.finalistId);
        }
        break;
        
      case 'showResults':
        juryVotingPhase.handleShowResults();
        break;
        
      case 'showFinaleStats':
        setPhase('Statistics');
        break;
        
      case 'reSimulate':
        window.location.reload();
        break;
    }
  };

  return {
    ...gameState,
    handlePlayerSelect: playerSelection.handlePlayerSelect,
    handleAction,
    setWeek,
    setPhase
  };
}

export default useGamePhaseManager;
