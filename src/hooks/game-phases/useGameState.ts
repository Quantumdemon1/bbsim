
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhaseProps, GamePhaseState, GamePhaseSetters, WeekSummary } from './types';

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
  const [weekSummaries, setWeekSummaries] = useState<WeekSummary[]>([]);
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
    votes,
    weekSummaries
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
    setVotes,
    setWeekSummaries
  };

  return {
    state: gameState,
    setters,
    toast
  };
}
