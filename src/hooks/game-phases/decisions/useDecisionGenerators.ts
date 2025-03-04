
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData, DecisionGenerators } from './types';
import { 
  generateAllianceDecision,
  generateNominationDecision, 
  generateEvictionVoteDecision,
  generateVetoDecision 
} from './generators';

/**
 * Hook to provide decision generation functions
 */
export function useDecisionGenerators(): DecisionGenerators {
  return {
    generateAllianceDecision,
    generateNominationDecision,
    generateEvictionVoteDecision,
    generateVetoDecision
  };
}
