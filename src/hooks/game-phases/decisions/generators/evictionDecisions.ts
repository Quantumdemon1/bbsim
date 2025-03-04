
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from '../types';

/**
 * Generate eviction vote decision
 */
export const generateEvictionVoteDecision = (nominees: string[], players: PlayerData[]): DecisionData => {
  const options = nominees.map(nomineeId => {
    const nominee = players.find(p => p.id === nomineeId);
    return {
      id: nomineeId,
      label: `Vote to Evict ${nominee?.name}`,
      description: nominee?.personality?.archetype 
        ? `The ${nominee.personality.archetype} player` 
        : undefined
    };
  });
  
  return {
    title: "Eviction Vote",
    description: "It's time to vote. Which houseguest do you want to evict from the Big Brother house?",
    situation: 'eviction',
    options
  };
};
