
import { StoryEvent } from '../types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { v4 as uuidv4 } from 'uuid';

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
