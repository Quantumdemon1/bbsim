import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision } from '../types';

/**
 * Helper function to sort players by threat level (for strategic decisions)
 */
export const sortPlayersByThreatLevel = (playerIds: string[], allPlayers: PlayerData[], currentPlayerId: string): string[] => {
  return [...playerIds].sort((a, b) => {
    const playerA = allPlayers.find(p => p.id === a);
    const playerB = allPlayers.find(p => p.id === b);
    
    if (!playerA || !playerB) return 0;
    
    // Calculate threat based on competition wins and overall attributes
    const threatA = calculateThreatLevel(playerA);
    const threatB = calculateThreatLevel(playerB);
    
    return threatB - threatA; // Higher threat first
  });
};

/**
 * Helper function to calculate a player's threat level
 */
export const calculateThreatLevel = (player: PlayerData): number => {
  const stats = player.stats || {};
  const attrs = player.attributes || { physical: 3, strategic: 3, social: 3 };
  
  // Competition threat
  const compWins = (stats.hohWins || 0) + (stats.povWins || 0);
  
  // Attribute-based threat
  const attrThreat = (attrs.physical + attrs.strategic * 1.5 + attrs.social) / 3;
  
  return compWins * 2 + attrThreat;
};

/**
 * Helper function to sort players by relationship (for social decisions)
 */
export const sortPlayersByRelationship = (
  playerIds: string[], 
  allPlayers: PlayerData[], 
  currentPlayerId: string,
  preferAllies: boolean
): string[] => {
  const currentPlayer = allPlayers.find(p => p.id === currentPlayerId);
  if (!currentPlayer || !currentPlayer.relationships) return playerIds;
  
  return [...playerIds].sort((a, b) => {
    const relA = currentPlayer.relationships?.find(r => r.targetId === a);
    const relB = currentPlayer.relationships?.find(r => r.targetId === b);
    
    const scoreA = relA ? relationshipToScore(relA.type) : 0;
    const scoreB = relB ? relationshipToScore(relB.type) : 0;
    
    // If preferAllies is true, put allies first (higher score first)
    // If preferAllies is false, put enemies first (lower score first)
    return preferAllies ? scoreB - scoreA : scoreA - scoreB;
  });
};

/**
 * Helper function to convert relationship type to numeric score
 */
export const relationshipToScore = (relType: string): number => {
  switch (relType) {
    case 'Enemy': return -2;
    case 'Rival': return -1;
    case 'Neutral': return 0;
    case 'Friend': return 1;
    case 'Ally': return 2;
    default: return 0;
  }
};

/**
 * Helper function to find an ally among the options
 */
export const findAlly = (playerId: string, options: string[], allPlayers: PlayerData[]): string | null => {
  const player = allPlayers.find(p => p.id === playerId);
  if (!player || !player.relationships) return null;
  
  // Look for allies or friends among the options
  const allies = player.relationships
    .filter(r => options.includes(r.targetId) && ['Ally', 'Friend'].includes(r.type))
    .map(r => r.targetId);
  
  return allies.length > 0 ? allies[0] : null;
};

/**
 * Helper function to sort players by compatibility for alliances
 */
export const sortPlayersByCompatibility = (playerIds: string[], allPlayers: PlayerData[], currentPlayerId: string): string[] => {
  const currentPlayer = allPlayers.find(p => p.id === currentPlayerId);
  if (!currentPlayer) return playerIds;
  
  return [...playerIds].sort((a, b) => {
    const playerA = allPlayers.find(p => p.id === a);
    const playerB = allPlayers.find(p => p.id === b);
    
    if (!playerA || !playerB) return 0;
    
    // Calculate compatibility based on attributes
    const compatA = calculateCompatibility(currentPlayer, playerA);
    const compatB = calculateCompatibility(currentPlayer, playerB);
    
    return compatB - compatA; // Higher compatibility first
  });
};

/**
 * Helper function to calculate compatibility between two players
 */
export const calculateCompatibility = (player1: PlayerData, player2: PlayerData): number => {
  const attrs1 = player1.attributes || { physical: 3, strategic: 3, social: 3, loyalty: 3 };
  const attrs2 = player2.attributes || { physical: 3, strategic: 3, social: 3, loyalty: 3 };
  
  // Complementary attributes are good (different strengths)
  const complementary = 
    Math.abs(attrs1.physical - attrs2.physical) + 
    Math.abs(attrs1.strategic - attrs2.strategic);
  
  // Similar loyalty and social values are good
  const similar = 
    5 - Math.abs(attrs1.loyalty - attrs2.loyalty) + 
    5 - Math.abs(attrs1.social - attrs2.social);
  
  return complementary + similar;
};

/**
 * Make a rule-based decision for an AI player
 */
export const makeRuleBasedDecision = (
  player: PlayerData,
  decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
  options: string[],
  players: PlayerData[],
  memory: any[]
): AIPlayerDecision => {
  // Get player attributes (or use defaults if not set)
  const attributes = player.attributes || {
    physical: 3,
    strategic: 3,
    social: 3,
    loyalty: 3,
    general: 3
  };
  
  // Make a weighted decision based on personality traits, memory, and game state
  let selectedOption: string | null = null;
  let decisionReasoning = "";
  
  switch (decisionType) {
    case 'nominate':
      // Strategic players target threats, social players target those who aren't well connected
      const nomPriority = attributes.strategic > attributes.social ? 
        sortPlayersByThreatLevel(options, players, player.id) :
        sortPlayersByRelationship(options, players, player.id, false);
      
      selectedOption = nomPriority[0] || options[0] || null;
      decisionReasoning = `${player.name} nominated based on ${attributes.strategic > attributes.social ? 'strategic threat assessment' : 'social dynamics'}`;
      break;
      
    case 'vote':
      // Check memory for betrayals and alliance information
      const betrayedBy = memory
        .filter(m => m.type === 'betrayal' && options.includes(m.relatedPlayerId))
        .map(m => m.relatedPlayerId);
      
      if (betrayedBy.length > 0) {
        // Vote for someone who betrayed them
        selectedOption = betrayedBy[0];
        decisionReasoning = `${player.name} voted based on previous betrayal`;
      } else {
        // Otherwise use loyalty and strategic assessment
        const votePriority = attributes.loyalty > attributes.strategic ?
          sortPlayersByRelationship(options, players, player.id, true) :
          sortPlayersByThreatLevel(options, players, player.id);
        
        selectedOption = votePriority[0] || options[0] || null;
        decisionReasoning = `${player.name} voted based on ${attributes.loyalty > attributes.strategic ? 'loyalty to allies' : 'strategic threat assessment'}`;
      }
      break;
      
    case 'veto':
      // Decision logic for using veto power
      const vetoTarget = findAlly(player.id, options, players);
      selectedOption = vetoTarget || options[0] || null;
      decisionReasoning = vetoTarget ? 
        `${player.name} used veto to save an ally` : 
        `${player.name} used veto based on strategic consideration`;
      break;
      
    case 'alliance':
      // Decision logic for forming alliances
      const potentialAllies = sortPlayersByCompatibility(options, players, player.id);
      selectedOption = potentialAllies[0] || options[0] || null;
      decisionReasoning = `${player.name} formed alliance based on compatibility assessment`;
      break;
  }
  
  return {
    decision: selectedOption,
    reasoning: decisionReasoning
  };
};
