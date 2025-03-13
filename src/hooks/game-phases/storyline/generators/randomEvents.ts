
import { StoryEvent } from '../types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhase } from '@/types/gameTypes';
import { Alliance } from '@/contexts/types';
import { v4 as uuidv4 } from 'uuid';
import { generateTargetedEvent } from './targetedEvents';

/**
 * Generate a random game event
 */
export const generateRandomGameEvent = (
  players: PlayerData[],
  currentPhase: GamePhase = 'HoH Competition',
  dayCount: number = 1,
  playerMood: string = 'neutral',
  alliances: Alliance[] = [],
  nominees: string[] = [],
  hoh: string | null = null
): StoryEvent | null => {
  // First try a targeted event based on game state (50% chance)
  if (Math.random() < 0.5) {
    const targetedEvent = generateTargetedEvent(
      players, 
      playerMood, 
      currentPhase, 
      alliances, 
      nominees, 
      hoh
    );
    
    if (targetedEvent) return targetedEvent;
  }
  
  // If no targeted event, fall back to generic events
  const eventTypes = ['twist', 'social', 'alliance'];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  // Phase-based probability adjustment
  let eventProbability = 0.3; // Base probability
  
  switch (currentPhase) {
    case 'HoH Competition':
      eventProbability = 0.2;
      break;
    case 'Nomination Ceremony':
      eventProbability = 0.4;
      break;
    case 'PoV Competition':
      eventProbability = 0.2;
      break;
    case 'Veto Ceremony':
      eventProbability = 0.4;
      break;
    case 'Eviction Voting':
      eventProbability = 0.5;
      break;
  }
  
  // Adjust based on day count (more events later in the week)
  eventProbability += Math.min(0.3, dayCount * 0.05);
  
  // Only generate event if probability check passes
  if (Math.random() > eventProbability) return null;
  
  // Generate the appropriate event
  if (eventType === 'twist') {
    return generateTwistEvent(currentPhase, eventProbability);
  } else if (eventType === 'social') {
    return generateSocialRandomEvent(players, currentPhase, eventProbability);
  } else {
    return generateAllianceEvent(players, currentPhase, eventProbability);
  }
};

/**
 * Generate a twist event
 */
const generateTwistEvent = (currentPhase: GamePhase, eventProbability: number): StoryEvent => {
  const twists = [
    {
      title: "America's Vote",
      description: "The audience has voted on a special power. You've been offered a chance to take it.",
      options: [
        { 
          id: 'accept', 
          text: "Accept the power", 
          consequence: "You gain a special power but become a target",
          relationshipEffect: -2,
          memoryImportance: 8
        },
        { 
          id: 'reject', 
          text: "Reject the power", 
          consequence: "You stay under the radar",
          relationshipEffect: 1,
          memoryImportance: 6
        }
      ]
    },
    {
      title: "Luxury Competition",
      description: "A special luxury competition is announced. Will you try hard to win?",
      options: [
        { 
          id: 'try', 
          text: "Give it your all", 
          consequence: "You might win a prize but expend energy",
          relationshipEffect: 0,
          memoryImportance: 5
        },
        { 
          id: 'conserve', 
          text: "Conserve your energy", 
          consequence: "You save energy for more important competitions",
          relationshipEffect: 0,
          memoryImportance: 4
        }
      ]
    },
    {
      title: "House Lockdown",
      description: "The house is on lockdown for a special event. How do you spend this time?",
      options: [
        { 
          id: 'socialize', 
          text: "Socialize with houseguests", 
          consequence: "You strengthen social bonds",
          relationshipEffect: 2,
          memoryImportance: 5
        },
        { 
          id: 'observe', 
          text: "Quietly observe others", 
          consequence: "You gather information about others",
          relationshipEffect: 0,
          memoryImportance: 6
        },
        { 
          id: 'rest', 
          text: "Rest and recharge", 
          consequence: "You gain energy for upcoming challenges",
          relationshipEffect: 0,
          memoryImportance: 4
        }
      ]
    }
  ];
  
  const selectedTwist = twists[Math.floor(Math.random() * twists.length)];
  return {
    id: `twist_${uuidv4()}`,
    title: selectedTwist.title,
    description: selectedTwist.description,
    type: 'twist',
    options: selectedTwist.options,
    frequency: [
      { phase: currentPhase, probability: eventProbability }
    ]
  };
};

/**
 * Generate a random social event
 */
const generateSocialRandomEvent = (
  players: PlayerData[], 
  currentPhase: GamePhase, 
  eventProbability: number
): StoryEvent | null => {
  // Pick a random player for a social interaction
  const availablePlayers = players.filter(p => !p.isHuman);
  if (availablePlayers.length === 0) return null;
  
  const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
  
  return {
    id: `social_${uuidv4()}`,
    title: `${randomPlayer.name} Approaches`,
    description: `${randomPlayer.name} wants to talk with you in private. How do you respond?`,
    type: 'social',
    options: [
      { 
        id: 'engage', 
        text: "Engage in conversation", 
        consequence: "You build rapport with them",
        relationshipEffect: 2,
        memoryImportance: 5
      },
      { 
        id: 'brief', 
        text: "Keep it brief", 
        consequence: "You maintain distance but stay cordial",
        relationshipEffect: 0,
        memoryImportance: 4
      },
      { 
        id: 'avoid', 
        text: "Find an excuse to leave", 
        consequence: "You avoid potentially revealing information",
        relationshipEffect: -1,
        memoryImportance: 5
      }
    ],
    requires: {
      playerId: randomPlayer.id
    },
    frequency: [
      { phase: currentPhase, probability: eventProbability }
    ]
  };
};

/**
 * Generate a random alliance event
 */
const generateAllianceEvent = (
  players: PlayerData[], 
  currentPhase: GamePhase, 
  eventProbability: number
): StoryEvent | null => {
  const potentialAllies = players.filter(p => !p.isHuman);
  if (potentialAllies.length < 2) return null;
  
  // Pick 2 random players
  const shuffled = [...potentialAllies].sort(() => 0.5 - Math.random());
  const ally1 = shuffled[0];
  const ally2 = shuffled[1];
  
  return {
    id: `alliance_${uuidv4()}`,
    title: "Alliance Opportunity",
    description: `${ally1.name} and ${ally2.name} are discussing forming an alliance and want you to join. What do you do?`,
    type: 'alliance',
    options: [
      { 
        id: 'join', 
        text: "Join their alliance", 
        consequence: "You gain protection but commit to them",
        relationshipEffect: 3,
        memoryImportance: 8,
        nextEventId: 'alliance_joined'
      },
      { 
        id: 'counter', 
        text: "Counter with your own alliance proposal", 
        consequence: "You try to take leadership",
        relationshipEffect: 1,
        memoryImportance: 7,
        nextEventId: 'alliance_leadership'
      },
      { 
        id: 'decline', 
        text: "Politely decline", 
        consequence: "You maintain independence but miss an opportunity",
        relationshipEffect: -1,
        memoryImportance: 6
      }
    ],
    frequency: [
      { phase: currentPhase, probability: eventProbability }
    ]
  };
};
