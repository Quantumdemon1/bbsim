
interface PlayerSelectionProps {
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  phase: string;
}

export function usePlayerSelection({
  selectedPlayers,
  setSelectedPlayers,
  phase
}: PlayerSelectionProps) {
  
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

  return {
    handlePlayerSelect
  };
}
