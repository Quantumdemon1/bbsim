
import { PlayerData } from '@/components/PlayerProfileTypes';

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
