import { DecisionContext } from '../types/decisionTypes';
import { AIPlayerDecision } from '../../types';
import { sortPlayersByThreatLevel, sortPlayersByRelationship } from '../utils/playerSorting';

export const makeVoteDecision = (
  context: DecisionContext
): AIPlayerDecision => {
  const { player, options, allPlayers, memory } = context;
  
  // Get player attributes (or use defaults if not set)
  const attributes = player.attributes || {
    loyalty: 3,
    strategic: 3
  };
  
  // Check memory for betrayals
  const betrayedBy = memory
    .filter(m => m.type === 'betrayal' && options.includes(m.relatedPlayerId || ''))
    .map(m => m.relatedPlayerId || '');
  
  if (betrayedBy.length > 0) {
    // Vote for someone who betrayed them
    const selectedOption = betrayedBy[0];
    const decisionReasoning = `${player.name} voted based on previous betrayal`;
    
    return {
      decision: selectedOption,
      reasoning: decisionReasoning
    };
  } 
    
  // Otherwise use loyalty and strategic assessment
  const votePriority = attributes.loyalty > attributes.strategic ?
    sortPlayersByRelationship(options, allPlayers, player.id, true) :
    sortPlayersByThreatLevel(options, allPlayers, player.id);
  
  const selectedOption = votePriority[0] || options[0] || null;
  const decisionReasoning = `${player.name} voted based on ${attributes.loyalty > attributes.strategic ? 'loyalty to allies' : 'strategic threat assessment'}`;
  
  return {
    decision: selectedOption,
    reasoning: decisionReasoning
  };
};
