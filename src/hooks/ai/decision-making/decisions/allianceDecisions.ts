
import { DecisionContext } from '../types/decisionTypes';
import { AIPlayerDecision } from '../../types';
import { sortPlayersByCompatibility } from '../utils/allianceUtils';

export const makeAllianceDecision = (
  context: DecisionContext
): AIPlayerDecision => {
  const { player, options, allPlayers } = context;
  
  // Decision logic for forming alliances
  const potentialAllies = sortPlayersByCompatibility(options, allPlayers, player.id);
  const selectedOption = potentialAllies[0] || options[0] || null;
  const decisionReasoning = `${player.name} formed alliance based on compatibility assessment`;
  
  return {
    decision: selectedOption,
    reasoning: decisionReasoning
  };
};
