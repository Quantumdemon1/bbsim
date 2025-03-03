
import { useGameContext } from '@/contexts/GameContext';
import { HoHPhaseProps } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';

/**
 * Hook to manage the Head of Household competition phase
 */
export function useHoHPhase({
  players,
  setPlayers,
  selectedPlayers,
  setHoH,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  lastHoH,
  setLastHoH,
  toast
}: HoHPhaseProps) {
  const { makeAIDecision, addAIMemoryEntry, generateAIDialogue } = useGameContext();
  
  const handleSelectHoH = async () => {
    if (selectedPlayers.length !== 1) {
      toast({
        title: "Error",
        description: "You must select exactly one player to be HoH",
        variant: "destructive"
      });
      return;
    }
    
    const newHoH = selectedPlayers[0];
    
    // Get the selected player
    const hohPlayer = players.find(p => p.id === newHoH);
    if (!hohPlayer) return;
    
    // Set the new HoH
    setHoH(newHoH);
    setLastHoH(newHoH);
    
    // Update player statuses
    const updatedPlayers = players.map(player => {
      if (player.id === newHoH) {
        return { ...player, status: 'hoh' as const };
      } else if (player.status === 'hoh') {
        return { ...player, status: 'safe' as const };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    // If the HoH is an AI player, generate dialogue
    if (hohPlayer && !hohPlayer.isHuman && !hohPlayer.isAdmin) {
      const dialogue = await generateAIDialogue(hohPlayer.id, 'hoh', {});
      console.log(`[AI HoH] ${hohPlayer.name}: ${dialogue}`);
      
      // Add memory entry for AI player
      addAIMemoryEntry(hohPlayer.id, {
        type: 'hoh',
        week: 1, // TODO: Get current week from game state
        description: 'Won Head of Household competition',
        impact: 'positive',
        importance: 5,
        timestamp: Date.now()
      });
    }
    
    // Move to the next phase
    setStatusMessage(`${hohPlayer?.name} is the new Head of Household!`);
    setPhase('Nomination Ceremony');
    setSelectedPlayers([]);
    
    toast({
      title: "New Head of Household!",
      description: `${hohPlayer?.name} is the new Head of Household!`
    });
  };
  
  return {
    handleSelectHoH
  };
}
