
import { StoryEvent } from '../types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { v4 as uuidv4 } from 'uuid';

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
