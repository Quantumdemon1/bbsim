
import { StoryEvent } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhase } from '@/types/gameTypes';

/**
 * Create a diary room event based on the current game phase
 */
export const createDiaryRoomEvent = (currentPhase: GamePhase): StoryEvent => {
  const getPromptForPhase = () => {
    switch (currentPhase) {
      case 'HoH Competition':
        return "What's your strategy going into this HoH competition?";
      case 'Nomination Ceremony':
        return "Who are you thinking of nominating and why?";
      case 'PoV Competition':
        return "How important is winning the veto to your game right now?";
      case 'Veto Ceremony':
        return "What are your thoughts on how the veto might be used?";
      case 'Eviction Voting':
        return "Who are you planning to vote out and why?";
      default:
        return "How do you feel about your position in the game right now?";
    }
  };
  
  return {
    id: `diary_${Date.now()}`,
    title: "Diary Room Confession",
    description: getPromptForPhase(),
    type: 'diary',
    options: [
      { id: 'strategic', text: "Share strategic thoughts", consequence: "Your game moves become more transparent" },
      { id: 'emotional', text: "Express your feelings", consequence: "Your social connections strengthen" },
      { id: 'deceptive', text: "Mislead about your intentions", consequence: "Your game becomes more secretive" }
    ]
  };
};

/**
 * Create a social interaction event with another player
 */
export const createSocialEvent = (targetPlayer: PlayerData): StoryEvent => {
  return {
    id: `social_${Date.now()}`,
    title: `Conversation with ${targetPlayer.name}`,
    description: `${targetPlayer.name} approaches you for a chat. How do you want to interact?`,
    type: 'social',
    options: [
      { id: 'game', text: "Talk game strategy", consequence: "May form strategic bond" },
      { id: 'personal', text: "Have a personal conversation", consequence: "May form social bond" },
      { id: 'alliance', text: "Propose an alliance", consequence: "May form a new alliance" },
      { id: 'distance', text: "Keep your distance", consequence: "Maintain game separation" }
    ],
    requires: {
      playerId: targetPlayer.id
    }
  };
};

/**
 * Generate a random game event
 */
export const generateRandomGameEvent = (players: PlayerData[]): StoryEvent | null => {
  // Pick a random event type
  const eventTypes = ['twist', 'social', 'alliance'];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  // Generate the appropriate event
  if (eventType === 'twist') {
    const twists = [
      {
        title: "America's Vote",
        description: "The audience has voted on a special power. You've been offered a chance to take it.",
        options: [
          { id: 'accept', text: "Accept the power", consequence: "You gain a special power but become a target" },
          { id: 'reject', text: "Reject the power", consequence: "You stay under the radar" }
        ]
      },
      {
        title: "Luxury Competition",
        description: "A special luxury competition is announced. Will you try hard to win?",
        options: [
          { id: 'try', text: "Give it your all", consequence: "You might win a prize but expend energy" },
          { id: 'conserve', text: "Conserve your energy", consequence: "You save energy for more important competitions" }
        ]
      },
      {
        title: "House Lockdown",
        description: "The house is on lockdown for a special event. How do you spend this time?",
        options: [
          { id: 'socialize', text: "Socialize with houseguests", consequence: "You strengthen social bonds" },
          { id: 'observe', text: "Quietly observe others", consequence: "You gather information about others" },
          { id: 'rest', text: "Rest and recharge", consequence: "You gain energy for upcoming challenges" }
        ]
      }
    ];
    
    const selectedTwist = twists[Math.floor(Math.random() * twists.length)];
    return {
      id: `twist_${Date.now()}`,
      title: selectedTwist.title,
      description: selectedTwist.description,
      type: 'twist',
      options: selectedTwist.options
    };
  } else if (eventType === 'social') {
    // Pick a random player for a social interaction
    const availablePlayers = players.filter(p => !p.isHuman);
    if (availablePlayers.length === 0) return null;
    
    const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    
    return {
      id: `social_${Date.now()}`,
      title: `${randomPlayer.name} Approaches`,
      description: `${randomPlayer.name} wants to talk with you in private. How do you respond?`,
      type: 'social',
      options: [
        { id: 'engage', text: "Engage in conversation", consequence: "You build rapport with them" },
        { id: 'brief', text: "Keep it brief", consequence: "You maintain distance but stay cordial" },
        { id: 'avoid', text: "Find an excuse to leave", consequence: "You avoid potentially revealing information" }
      ],
      requires: {
        playerId: randomPlayer.id
      }
    };
  } else {
    // Alliance event
    const potentialAllies = players.filter(p => !p.isHuman);
    if (potentialAllies.length < 2) return null;
    
    // Pick 2 random players
    const shuffled = [...potentialAllies].sort(() => 0.5 - Math.random());
    const ally1 = shuffled[0];
    const ally2 = shuffled[1];
    
    return {
      id: `alliance_${Date.now()}`,
      title: "Alliance Opportunity",
      description: `${ally1.name} and ${ally2.name} are discussing forming an alliance and want you to join. What do you do?`,
      type: 'alliance',
      options: [
        { id: 'join', text: "Join their alliance", consequence: "You gain protection but commit to them" },
        { id: 'counter', text: "Counter with your own alliance proposal", consequence: "You try to take leadership" },
        { id: 'decline', text: "Politely decline", consequence: "You maintain independence but miss an opportunity" }
      ]
    };
  }
};
