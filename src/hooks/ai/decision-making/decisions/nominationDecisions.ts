
import { DecisionContext } from '../types/decisionTypes';
import { AIPlayerDecision } from '../../types';
import { sortPlayersByThreatLevel, sortPlayersByRelationship } from '../utils/playerSorting';

export const makeNominationDecision = (
  context: DecisionContext
): AIPlayerDecision => {
  const { player, options, allPlayers } = context;
  
  // Get player attributes (or use defaults if not set)
  const attributes = player.attributes || {
    strategic: 3,
    social: 3
  };
  
  // Strategic players target threats, social players target those who aren't well connected
  const nomPriority = attributes.strategic > attributes.social ? 
    sortPlayersByThreatLevel(options, allPlayers, player.id) :
    sortPlayersByRelationship(options, allPlayers, player.id, false);
  
  const selectedOption = nomPriority[0] || options[0] || null;
  const decisionReasoning = `${player.name} nominated based on ${attributes.strategic > attributes.social ? 'strategic threat assessment' : 'social dynamics'}`;
  
  return {
    decision: selectedOption,
    reasoning: decisionReasoning
  };
};
