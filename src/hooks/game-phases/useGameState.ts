
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfile';
import { GamePhaseProps, GamePhaseState, GamePhaseSetters } from './types';

export function useGameState({ 
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

  const gameState: GamePhaseState = {
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

  const setters: GamePhaseSetters = {
    setWeek,
    setPlayers,
    setPhase,
    setHoH,
    setVeto,
    setNominees,
    setSelectedPlayers,
    setStatusMessage,
    setFinalists,
    setJurors,
    setVotes
  };

  return {
    state: gameState,
    setters,
    toast
  };
}
