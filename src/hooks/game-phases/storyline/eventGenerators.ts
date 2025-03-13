
import { StoryEvent } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhase } from '@/types/gameTypes';
import { Alliance } from '@/contexts/types';
import { v4 as uuidv4 } from 'uuid';

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
    id: `diary_${uuidv4()}`,
    title: "Diary Room Confession",
    description: getPromptForPhase(),
    type: 'diary',
    options: [
      { 
        id: 'strategic', 
        text: "Share strategic thoughts", 
        consequence: "Your game moves become more transparent",
        relationshipEffect: 0,
        memoryImportance: 5
      },
      { 
        id: 'emotional', 
        text: "Express your feelings", 
        consequence: "Your social connections strengthen",
        relationshipEffect: 2,
        memoryImportance: 4
      },
      { 
        id: 'deceptive', 
        text: "Mislead about your intentions", 
        consequence: "Your game becomes more secretive",
        relationshipEffect: -1,
        memoryImportance: 7
      }
    ],
    frequency: [
      { phase: 'HoH Competition', probability: 0.5 },
      { phase: 'Nomination Ceremony', probability: 0.7 },
      { phase: 'PoV Competition', probability: 0.4 },
      { phase: 'Veto Ceremony', probability: 0.6 },
      { phase: 'Eviction Voting', probability: 0.8 }
    ]
  };
};

/**
 * Create a social interaction event with another player
 */
export const createSocialEvent = (
  targetPlayer: PlayerData, 
  playerRelationship: string = 'Neutral',
  alliances: Alliance[] = []
): StoryEvent => {
  // Check if in alliance together
  const inAlliance = alliances.some(a => 
    a.members.includes(targetPlayer.id) && 
    a.members.some(m => targetPlayer.isHuman === false)
  );
  
  // Personalize options based on relationship
  const options = [];
  
  // Always available options
  options.push({ 
    id: 'game', 
    text: "Talk game strategy", 
    consequence: "May form strategic bond",
    relationshipEffect: 1,
    memoryImportance: 5
  });
  
  options.push({ 
    id: 'personal', 
    text: "Have a personal conversation", 
    consequence: "May form social bond",
    relationshipEffect: 2,
    memoryImportance: 4
  });
  
  // Conditional options based on relationship
  if (playerRelationship === 'Friend' || playerRelationship === 'Ally') {
    options.push({ 
      id: 'strengthen', 
      text: "Strengthen your alliance", 
      consequence: "Solidify trust and loyalty",
      relationshipEffect: 3,
      memoryImportance: 7
    });
  }
  
  if (playerRelationship === 'Enemy' || playerRelationship === 'Target') {
    options.push({ 
      id: 'manipulate', 
      text: "Manipulate their perception", 
      consequence: "They may lower their guard against you",
      relationshipEffect: -1,
      memoryImportance: 8
    });
  }
  
  if (!inAlliance) {
    options.push({ 
      id: 'alliance', 
      text: "Propose an alliance", 
      consequence: "May form a new alliance",
      relationshipEffect: 3,
      memoryImportance: 9,
      nextEventId: `alliance_formation_${targetPlayer.id}`
    });
  }
  
  options.push({ 
    id: 'distance', 
    text: "Keep your distance", 
    consequence: "Maintain game separation",
    relationshipEffect: -1,
    memoryImportance: 3
  });
  
  return {
    id: `social_${uuidv4()}`,
    title: `Conversation with ${targetPlayer.name}`,
    description: `${targetPlayer.name} approaches you for a chat. How do you want to interact?`,
    type: 'social',
    options,
    requires: {
      playerId: targetPlayer.id,
      relationship: playerRelationship
    },
    personalityTags: targetPlayer.personality?.traits || [],
    frequency: [
      { phase: 'HoH Competition', probability: 0.3 },
      { phase: 'Nomination Ceremony', probability: 0.5 },
      { phase: 'PoV Competition', probability: 0.3 },
      { phase: 'Veto Ceremony', probability: 0.5 },
      { phase: 'Eviction Voting', probability: 0.6 }
    ]
  };
};

/**
 * Generate a targeted event based on player relationships and game status
 */
export const generateTargetedEvent = (
  players: PlayerData[],
  playerMood: string,
  currentPhase: GamePhase,
  alliances: Alliance[] = [],
  nominees: string[] = [],
  hoh: string | null = null,
  veto: string | null = null
): StoryEvent | null => {
  const humanPlayer = players.find(p => p.isHuman);
  if (!humanPlayer) return null;
  
  const isNominated = nominees.includes(humanPlayer.id);
  const isHoh = hoh === humanPlayer.id;
  const hasVeto = veto === humanPlayer.id;
  
  // Create event pool based on game state
  const eventPool: StoryEvent[] = [];
  
  // HOH Power events
  if (isHoh) {
    eventPool.push({
      id: `hoh_power_${uuidv4()}`,
      title: "Power of HoH",
      description: "As HoH, you have significant influence this week. How will you wield your power?",
      type: 'twist',
      options: [
        { 
          id: 'public', 
          text: "Make a public declaration about your targets", 
          consequence: "Players will know your intentions",
          relationshipEffect: -2,
          memoryImportance: 8,
          nextEventId: 'hoh_declaration'
        },
        { 
          id: 'secret', 
          text: "Keep your intentions private", 
          consequence: "Players will be uncertain and anxious",
          relationshipEffect: 0,
          memoryImportance: 6
        },
        { 
          id: 'mislead', 
          text: "Mislead houseguests about your plans", 
          consequence: "Create confusion but risk being caught in a lie",
          relationshipEffect: -3,
          memoryImportance: 9
        }
      ],
      frequency: [{ phase: 'Nomination Ceremony', probability: 0.8 }]
    });
  }
  
  // Nomination survival events
  if (isNominated && currentPhase === 'PoV Competition') {
    eventPool.push({
      id: `nomination_reaction_${uuidv4()}`,
      title: "On the Block",
      description: "You're on the block this week. How will you handle the pressure?",
      type: 'twist',
      options: [
        { 
          id: 'campaign', 
          text: "Campaign aggressively to stay", 
          consequence: "You'll make your intentions clear",
          relationshipEffect: 0,
          memoryImportance: 7
        },
        { 
          id: 'relax', 
          text: "Stay calm and seem unthreatening", 
          consequence: "You might appear less of a target",
          relationshipEffect: 1,
          memoryImportance: 5
        },
        { 
          id: 'blame', 
          text: "Shift blame to another houseguest", 
          consequence: "May create a new target but make an enemy",
          relationshipEffect: -4,
          memoryImportance: 9,
          nextEventId: 'blame_fallout'
        }
      ],
      frequency: [{ phase: 'PoV Competition', probability: 0.9 }]
    });
  }
  
  // Alliance events
  if (alliances.some(a => a.members.includes(humanPlayer.id))) {
    const alliance = alliances.find(a => a.members.includes(humanPlayer.id));
    
    if (alliance) {
      const allianceMembers = players.filter(p => alliance.members.includes(p.id));
      const randomMember = allianceMembers[Math.floor(Math.random() * allianceMembers.length)];
      
      if (randomMember && randomMember.id !== humanPlayer.id) {
        eventPool.push({
          id: `alliance_test_${uuidv4()}`,
          title: "Alliance Loyalty Test",
          description: `${randomMember.name} asks you to prove your loyalty to your alliance "${alliance.name}".`,
          type: 'alliance',
          options: [
            { 
              id: 'prove', 
              text: "Take a risk to prove your loyalty", 
              consequence: "Strengthen alliance bonds but potentially expose yourself",
              relationshipEffect: 4,
              memoryImportance: 8,
              nextEventId: 'alliance_strengthened'
            },
            { 
              id: 'deflect', 
              text: "Deflect and avoid the test", 
              consequence: "Maintain safety but raise suspicion",
              relationshipEffect: -2,
              memoryImportance: 6
            },
            { 
              id: 'counter', 
              text: "Question their loyalty instead", 
              consequence: "Create tension but possibly expose a betrayal",
              relationshipEffect: -1,
              memoryImportance: 7
            }
          ],
          requires: {
            playerId: randomMember.id
          },
          frequency: [
            { phase: 'HoH Competition', probability: 0.2 },
            { phase: 'Nomination Ceremony', probability: 0.4 },
            { phase: 'Eviction Voting', probability: 0.5 }
          ]
        });
      }
    }
  }
  
  // Return a random event from the pool, weighted by current phase
  const validEvents = eventPool.filter(event => {
    // Check if this event has a frequency for the current phase
    const phaseFrequency = event.frequency?.find(f => f.phase === currentPhase);
    if (!phaseFrequency) return false;
    
    // Random chance based on probability
    return Math.random() < phaseFrequency.probability;
  });
  
  if (validEvents.length === 0) return null;
  
  return validEvents[Math.floor(Math.random() * validEvents.length)];
};

/**
 * Generate a multi-stage storyline event based on previous choices
 */
export const generateStorylineEvent = (
  storylineId: string,
  sequence: number,
  previousChoices: Record<number, string>,
  players: PlayerData[]
): StoryEvent | null => {
  // Alliance betrayal storyline
  if (storylineId === 'alliance_betrayal') {
    if (sequence === 1) {
      // First event in the storyline
      const randomPlayer = players.filter(p => !p.isHuman)[Math.floor(Math.random() * players.filter(p => !p.isHuman).length)];
      
      return {
        id: `betrayal_s1_${uuidv4()}`,
        title: "Whispers of Betrayal",
        description: `${randomPlayer.name} tells you they overheard someone in your alliance plotting against you. Do you believe them?`,
        type: 'twist',
        options: [
          { 
            id: 'believe', 
            text: "Trust their information", 
            consequence: "You become suspicious of your alliance",
            relationshipEffect: 2,
            memoryImportance: 7,
            nextEventId: 'betrayal_investigation'
          },
          { 
            id: 'doubt', 
            text: "Doubt their information", 
            consequence: "You maintain alliance trust but might be vulnerable",
            relationshipEffect: -1,
            memoryImportance: 6,
            nextEventId: 'betrayal_evidence'
          },
          { 
            id: 'confront', 
            text: "Confront your alliance directly", 
            consequence: "Force the issue into the open",
            relationshipEffect: 0,
            memoryImportance: 8,
            nextEventId: 'betrayal_confrontation'
          }
        ],
        requires: {
          playerId: randomPlayer.id
        },
        storylineId: 'alliance_betrayal',
        sequence: 1
      };
    } else if (sequence === 2) {
      // Second event depends on first choice
      const firstChoice = previousChoices[1];
      
      if (firstChoice === 'believe') {
        return {
          id: `betrayal_s2_believe_${uuidv4()}`,
          title: "The Investigation",
          description: "You decide to secretly investigate the betrayal rumor. What's your approach?",
          type: 'twist',
          options: [
            { 
              id: 'spy', 
              text: "Spy on alliance conversations", 
              consequence: "Gather information but risk being caught",
              relationshipEffect: -1,
              memoryImportance: 7,
              nextEventId: 'betrayal_revelation'
            },
            { 
              id: 'recruit', 
              text: "Recruit a trusted ally to help", 
              consequence: "More effective investigation but involves another person",
              relationshipEffect: 3,
              memoryImportance: 6,
              nextEventId: 'betrayal_alliance'
            },
            { 
              id: 'trap', 
              text: "Set a trap with false information", 
              consequence: "May expose the betrayer but creates mistrust",
              relationshipEffect: -2,
              memoryImportance: 8,
              nextEventId: 'betrayal_trap_outcome'
            }
          ],
          storylineId: 'alliance_betrayal',
          sequence: 2
        };
      } else if (firstChoice === 'doubt') {
        return {
          id: `betrayal_s2_doubt_${uuidv4()}`,
          title: "Evidence Emerges",
          description: "Despite your doubts, you find evidence suggesting the betrayal might be real. How do you proceed?",
          type: 'twist',
          options: [
            { 
              id: 'reconsider', 
              text: "Take the threat seriously now", 
              consequence: "Better late than never, but you've lost time",
              relationshipEffect: 0,
              memoryImportance: 7,
              nextEventId: 'betrayal_late_action'
            },
            { 
              id: 'dismiss', 
              text: "Still dismiss it as gameplay", 
              consequence: "Maintain alliance cohesion but remain vulnerable",
              relationshipEffect: 1,
              memoryImportance: 5,
              nextEventId: 'betrayal_vulnerable'
            },
            { 
              id: 'counter', 
              text: "Prepare a counter-betrayal", 
              consequence: "Strike first against the potential betrayer",
              relationshipEffect: -4,
              memoryImportance: 9,
              nextEventId: 'betrayal_counter'
            }
          ],
          storylineId: 'alliance_betrayal',
          sequence: 2
        };
      } else if (firstChoice === 'confront') {
        return {
          id: `betrayal_s2_confront_${uuidv4()}`,
          title: "The Confrontation Fallout",
          description: "Your direct confrontation has caused chaos in the alliance. What's your next move?",
          type: 'twist',
          options: [
            { 
              id: 'damage', 
              text: "Try to repair the damage", 
              consequence: "Attempt to rebuild trust within the alliance",
              relationshipEffect: 2,
              memoryImportance: 7,
              nextEventId: 'betrayal_repair'
            },
            { 
              id: 'abandon', 
              text: "Abandon the alliance", 
              consequence: "Break away and seek new allies",
              relationshipEffect: -2,
              memoryImportance: 8,
              nextEventId: 'betrayal_new_allies'
            },
            { 
              id: 'leadership', 
              text: "Assert leadership in the chaos", 
              consequence: "Try to take control of the fractured alliance",
              relationshipEffect: 0,
              memoryImportance: 9,
              nextEventId: 'betrayal_leadership'
            }
          ],
          storylineId: 'alliance_betrayal',
          sequence: 2
        };
      }
    } else if (sequence === 3) {
      // Final event in the storyline - resolution
      return {
        id: `betrayal_s3_${uuidv4()}`,
        title: "The Truth Revealed",
        description: "The true nature of the betrayal situation becomes clear. How will you handle the revelation?",
        type: 'twist',
        options: [
          { 
            id: 'forgive', 
            text: "Forgive and strategically move forward", 
            consequence: "Show grace but remember the lesson",
            relationshipEffect: 3,
            memoryImportance: 8
          },
          { 
            id: 'revenge', 
            text: "Plan your revenge", 
            consequence: "Target those who wronged you",
            relationshipEffect: -5,
            memoryImportance: 10
          },
          { 
            id: 'reset', 
            text: "Use this as a fresh start", 
            consequence: "Reset your game with new knowledge",
            relationshipEffect: 0,
            memoryImportance: 7
          }
        ],
        storylineId: 'alliance_betrayal',
        sequence: 3,
        isComplete: true
      };
    }
  }
  
  return null;
};

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
  } else if (eventType === 'social') {
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
  } else {
    // Alliance event
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
  }
};
