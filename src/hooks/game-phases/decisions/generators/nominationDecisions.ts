
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from '../types';

/**
 * Generate nomination decision
 */
export const generateNominationDecision = (eligiblePlayers: PlayerData[]): DecisionData => {
  const options = eligiblePlayers.map(player => ({
    id: player.id,
    label: `Nominate ${player.name}`,
    description: player.personality?.archetype 
      ? `The ${player.personality.archetype} player` 
      : undefined
  }));
  
  return {
    title: "Nomination Decision",
    description: "As Head of Household, you must nominate two houseguests for eviction. Choose your first nominee.",
    situation: 'nomination',
    options
  };
};
