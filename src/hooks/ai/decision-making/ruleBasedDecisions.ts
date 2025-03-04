
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision, AIMemoryEntry } from '../types';
import { DecisionType, DecisionContext } from './types/decisionTypes';
import { makeNominationDecision } from './decisions/nominationDecisions';
import { makeVoteDecision } from './decisions/voteDecisions';
import { makeVetoDecision } from './decisions/vetoDecisions';
import { makeAllianceDecision } from './decisions/allianceDecisions';

// Re-export utility functions for backward compatibility
export { sortPlayersByThreatLevel, calculateThreatLevel, sortPlayersByRelationship, relationshipToScore } from './utils/playerSorting';
export { findAlly, sortPlayersByCompatibility, calculateCompatibility } from './utils/allianceUtils';

/**
 * Make a rule-based decision for an AI player
 */
export const makeRuleBasedDecision = (
  player: PlayerData,
  decisionType: DecisionType,
  options: string[],
  players: PlayerData[],
  memory: AIMemoryEntry[]
): AIPlayerDecision => {
  // Create shared context for all decision types
  const context: DecisionContext = {
    player,
    options,
    allPlayers: players,
    memory
  };
  
  // Route to the appropriate decision function based on type
  switch (decisionType) {
    case 'nominate':
      return makeNominationDecision(context);
      
    case 'vote':
      return makeVoteDecision(context);
      
    case 'veto':
      return makeVetoDecision(context);
      
    case 'alliance':
      return makeAllianceDecision(context);
      
    default:
      // Fallback for TypeScript exhaustiveness
      return {
        decision: options[0] || null,
        reasoning: `${player.name} made a default decision`
      };
  }
};
