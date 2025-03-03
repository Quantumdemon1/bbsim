import { PlayerData } from '@/components/PlayerProfileTypes';
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

// Updated mock player data with proper images and profiles
export const mockPlayers: PlayerData[] = [
  { 
    id: '1', 
    name: 'Alison Irwin', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '2', 
    name: 'Amanda Craig', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '3', 
    name: 'Dana Varela', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '4', 
    name: 'David Lane', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '5', 
    name: 'Erika Landin', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '6', 
    name: 'Jack Owens', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '7', 
    name: 'Jee Choe', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '8', 
    name: 'Jun Song', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '9', 
    name: 'Justin Giovinco', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '10', 
    name: 'Michelle Maradie', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '11', 
    name: 'Nathan Marlow', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '12', 
    name: 'Robert Roman', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
];
