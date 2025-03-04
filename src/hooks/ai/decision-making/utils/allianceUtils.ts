
import { PlayerData } from '@/components/PlayerProfileTypes';

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
