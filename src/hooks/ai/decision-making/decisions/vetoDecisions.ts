
import { DecisionContext } from '../types/decisionTypes';
import { AIPlayerDecision } from '../../types';
import { findAlly } from '../utils/allianceUtils';

export const makeVetoDecision = (
  context: DecisionContext
): AIPlayerDecision => {
  const { player, options, allPlayers } = context;
  
  // Decision logic for using veto power
  const vetoTarget = findAlly(player.id, options, allPlayers);
  const selectedOption = vetoTarget || options[0] || null;
  const decisionReasoning = vetoTarget ? 
    `${player.name} used veto to save an ally` : 
    `${player.name} used veto based on strategic consideration`;
  
  return {
    decision: selectedOption,
    reasoning: decisionReasoning
  };
};
