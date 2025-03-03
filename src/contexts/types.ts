
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes, PlayerRelationship, BotEmotions, AIMemoryEntry } from '@/hooks/game-phases/types';
import { Notification, PlayerSettings } from '@/hooks/usePlayerAuth';
import { PhaseProgressInfo } from '@/hooks/gameState/types/phaseProgressTypes';
import { SavedGameState } from '@/hooks/gameState/types/gameStatePersistenceTypes';

export interface GameContextType {
  // Player Management
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  updatePlayerAttributes: (playerId: string, attributes: PlayerAttributes) => void;
  updatePlayerRelationships: (playerId: string, relationships: PlayerRelationship[]) => void;
  
  // Game State
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
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayers: PlayerData[];
  countdownTimer: number | null;
  createSinglePlayerGame: (bypassAuth?: boolean) => boolean;
  createMultiplayerGame: (hostName: string) => boolean;
  joinMultiplayerGame: (gameId: string, playerName: string) => boolean;
  
  // Admin Control
  adminTakeControl: (phaseToSkipTo?: string) => void;
  isAdminControl: boolean;
  loginAsAdmin: () => void;
  isAdmin: boolean;
  
  // Phase Progress
  phaseProgress: Record<string, { playersReady: string[], completed: boolean }>;
  phaseCountdown: number | null;
  markPhaseProgress: (phase: string, playerId: string) => void;
  getPhaseProgress: (phase: string) => PhaseProgressInfo | null;
  startPhaseCountdown: (seconds: number) => void;
  clearPhaseProgress: (phase: string) => void;
  
  // Game Persistence
  saveGame: () => Promise<void>;
  loadGame: (gameId: string) => Promise<boolean>;
  savedGames: SavedGameState[];
  deleteSavedGame: (gameId: string) => Promise<boolean>;
  isLoadingSave: boolean;
  
  // Alliance Management
  alliances: Alliance[];
  createAlliance: (name: string, members: string[]) => void;
  addToAlliance: (allianceId: string, playerId: string) => void;
  removeFromAlliance: (allianceId: string, playerId: string) => void;
  
  // Powerup Management
  awardPowerup: (playerId: string, powerup: PlayerData['powerup']) => void;
  usePowerup: (playerId: string) => void;
  
  // Player Authentication
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
  login: (player: PlayerData) => void;
  register: (player: PlayerData) => void;
  loginAsGuest: (guestName: string) => void;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<PlayerData>) => void;
  updateSettings: (newSettings: Partial<PlayerSettings>) => void;
  
  // Friends
  friends: string[];
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  settings: PlayerSettings;
  
  // AI Player Management
  makeAIDecision: (playerId: string, decisionType: string, options: any) => Promise<any>;
  generateAIDialogue: (playerId: string, eventType: string, context: any) => Promise<string>;
  addAIMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void;
  clearAIMemory: (playerId: string) => void;
  getPlayerMemory: (playerId: string) => AIMemoryEntry[];
  isUsingLLM: boolean;
  toggleLLMDecisionMaking: () => void;
  isThinking: boolean;
  botEmotions: BotEmotions;
  updateBotEmotion: (playerId: string, emotion: string) => void;
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
    bio: 'Retail sales manager with a competitive spirit and a knack for strategy.',
    age: 22,
    hometown: 'Philadelphia, PA',
    occupation: 'Retail Sales Manager',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '2', 
    name: 'Amanda Craig', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Dance instructor with a bubbly personality who always sees the best in people.',
    age: 25,
    hometown: 'Chicago, IL',
    occupation: 'Dance Instructor',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '3', 
    name: 'Dana Varela', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Opinionated bartender who isn\'t afraid to speak her mind in any situation.',
    age: 28,
    hometown: 'New York, NY',
    occupation: 'Bartender',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '4', 
    name: 'David Lane', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Former military man with a strict code of honor that guides his gameplay.',
    age: 33,
    hometown: 'Austin, TX',
    occupation: 'Security Consultant',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '5', 
    name: 'Erika Landin', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Bookstore owner with a quiet demeanor but sharp strategic mind.',
    age: 31,
    hometown: 'Boston, MA',
    occupation: 'Bookstore Owner',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '6', 
    name: 'Jack Owens', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Former college athlete who relies on his physical abilities and charm.',
    age: 24,
    hometown: 'Miami, FL',
    occupation: 'Personal Trainer',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '7', 
    name: 'Jee Choe', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Tech entrepreneur with a logical approach to the game and social situations.',
    age: 29,
    hometown: 'San Francisco, CA',
    occupation: 'Tech Entrepreneur',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '8', 
    name: 'Jun Song', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Food writer with a biting wit and excellent observation skills.',
    age: 27,
    hometown: 'Los Angeles, CA',
    occupation: 'Food Writer',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '9', 
    name: 'Justin Giovinco', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Law student with a photographic memory and talent for debate.',
    age: 26,
    hometown: 'Washington, DC',
    occupation: 'Law Student',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '10', 
    name: 'Michelle Maradie', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Kindergarten teacher with a sweet demeanor but surprisingly cunning gameplay.',
    age: 23,
    hometown: 'Denver, CO',
    occupation: 'Kindergarten Teacher',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '11', 
    name: 'Nathan Marlow', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Construction worker with a straightforward approach and strong work ethic.',
    age: 32,
    hometown: 'Detroit, MI',
    occupation: 'Construction Worker',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
  { 
    id: '12', 
    name: 'Robert Roman', 
    image: '/lovable-uploads/cc8e18cc-c692-4d0e-a9bd-f846d4d214c6.png',
    bio: 'Marketing executive with a silver tongue and knack for manipulation.',
    age: 35,
    hometown: 'Atlanta, GA',
    occupation: 'Marketing Executive',
    stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
  },
];
