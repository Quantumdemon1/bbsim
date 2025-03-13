
import { StoryEvent } from '../types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhase } from '@/types/gameTypes';
import { Alliance } from '@/contexts/types';
import { v4 as uuidv4 } from 'uuid';

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
