
import { PlayerData } from '@/components/PlayerProfile';
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types';

export interface GameContextType {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  gameId: string | null;
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  isHost: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  alliances: Alliance[];
  createAlliance: (name: string, members: string[]) => void;
  addToAlliance: (allianceId: string, playerId: string) => void;
  removeFromAlliance: (allianceId: string, playerId: string) => void;
  awardPowerup: (playerId: string, powerup: PlayerData['powerup']) => void;
  usePowerup: (playerId: string) => void;
  updatePlayerAttributes: (playerId: string, attributes: PlayerAttributes) => void;
  updatePlayerRelationships: (playerId: string, relationships: PlayerRelationship[]) => void;
}

export interface Alliance {
  id: string;
  name: string;
  members: string[];
}

// Mock player data
export const mockPlayers: PlayerData[] = [
  { id: '1', name: 'Alison Irwin', image: '/lovable-uploads/cec1a3bf-b0b6-4618-9c68-1585b9e53db4.png' },
  { id: '2', name: 'Amanda Craig', image: '/lovable-uploads/91a67156-682e-4ddb-a5dd-5865bb9e6039.png' },
  { id: '3', name: 'Dana Varela', image: '/lovable-uploads/62e1b219-b620-4564-afbf-ee01822b7c62.png' },
  { id: '4', name: 'David Lane', image: '/lovable-uploads/23bf364e-3dd8-45f7-be75-bce577622671.png' },
  { id: '5', name: 'Erika Landin', image: '/lovable-uploads/b8053ed2-cc2a-4313-9be2-3d9645df4658.png' },
  { id: '6', name: 'Jack Owens', image: '/lovable-uploads/217fbf50-5a84-4ce2-adff-3dafacb78567.png' },
  { id: '7', name: 'Jee Choe', image: '/placeholder.svg' },
  { id: '8', name: 'Jun Song', image: '/placeholder.svg' },
  { id: '9', name: 'Justin Giovinco', image: '/placeholder.svg' },
  { id: '10', name: 'Michelle Maradie', image: '/placeholder.svg' },
  { id: '11', name: 'Nathan Marlow', image: '/placeholder.svg' },
  { id: '12', name: 'Robert Roman', image: '/placeholder.svg' },
  { id: '13', name: 'Scott Weintraub', image: '/placeholder.svg' },
];
