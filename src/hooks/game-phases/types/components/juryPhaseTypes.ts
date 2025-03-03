
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface JuryQuestionsProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  setSelectedPlayers: (players: string[]) => void;
}

export interface JuryVotingProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setVotes: (votes: Record<string, string>) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  votes: Record<string, string>;
  setSelectedPlayers: (players: string[]) => void;
}
