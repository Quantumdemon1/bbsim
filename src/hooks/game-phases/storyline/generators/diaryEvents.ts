
import { StoryEvent } from '../types';
import { GamePhase } from '@/types/gameTypes';
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
