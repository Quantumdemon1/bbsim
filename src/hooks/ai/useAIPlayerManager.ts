import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry, AIPlayerAttributes, AIPlayerDecision } from './types';

/**
 * Hook to manage AI player behavior and decision-making
 */
export function useAIPlayerManager(players: PlayerData[]) {
  // Store AI player memory (game events, interactions, etc.)
  const [aiMemory, setAIMemory] = useState<Record<string, AIMemoryEntry[]>>({});
  
  // Initialize AI memory for new players
  useEffect(() => {
    const aiPlayers = players.filter(p => !p.isHuman && !p.isAdmin);
    
    // Initialize memory for AI players that don't have it yet
    const newMemory = { ...aiMemory };
    let memoryUpdated = false;
    
    aiPlayers.forEach(player => {
      if (!newMemory[player.id]) {
        newMemory[player.id] = [];
        memoryUpdated = true;
      }
    });
    
    if (memoryUpdated) {
      setAIMemory(newMemory);
    }
  }, [players]);
  
  /**
   * Add a memory entry for an AI player
   */
  const addMemoryEntry = (playerId: string, entry: AIMemoryEntry) => {
    setAIMemory(prev => {
      const playerMemory = prev[playerId] || [];
      // Keep memory buffer limited to most recent events
      const updatedMemory = [...playerMemory, entry].slice(-20);
      
      return {
        ...prev,
        [playerId]: updatedMemory
      };
    });
  };
  
  /**
   * Clear all AI memory (used when starting a new game)
   */
  const clearAIMemory = () => {
    setAIMemory({});
  };
  
  /**
   * Make a strategic decision for an AI player based on their personality and memory
   */
  const makeAIDecision = (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ): AIPlayerDecision => {
    const player = players.find(p => p.id === playerId);
    if (!player) {
      console.error(`AI player ${playerId} not found`);
      return { 
        decision: options[0] || null,
        reasoning: "Default decision due to player not found"
      };
    }
    
    // Get player attributes (or use defaults if not set)
    const attributes = player.attributes || {
      physical: 3,
      strategic: 3,
      social: 3,
      loyalty: 3
    };
    
    // Get player memory
    const memory = aiMemory[playerId] || [];
    
    // Make a weighted decision based on personality traits, memory, and game state
    let selectedOption: string | null = null;
    let decisionReasoning = "";
    
    switch (decisionType) {
      case 'nominate':
        // Strategic players target threats, social players target those who aren't well connected
        const nomPriority = attributes.strategic > attributes.social ? 
          sortPlayersByThreatLevel(options, players, playerId) :
          sortPlayersByRelationship(options, players, playerId, false);
        
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
            sortPlayersByRelationship(options, players, playerId, true) :
            sortPlayersByThreatLevel(options, players, playerId);
          
          selectedOption = votePriority[0] || options[0] || null;
          decisionReasoning = `${player.name} voted based on ${attributes.loyalty > attributes.strategic ? 'loyalty to allies' : 'strategic threat assessment'}`;
        }
        break;
        
      case 'veto':
        // Decision logic for using veto power
        const vetoTarget = findAlly(playerId, options, players);
        selectedOption = vetoTarget || options[0] || null;
        decisionReasoning = vetoTarget ? 
          `${player.name} used veto to save an ally` : 
          `${player.name} used veto based on strategic consideration`;
        break;
        
      case 'alliance':
        // Decision logic for forming alliances
        const potentialAllies = sortPlayersByCompatibility(options, players, playerId);
        selectedOption = potentialAllies[0] || options[0] || null;
        decisionReasoning = `${player.name} formed alliance based on compatibility assessment`;
        break;
    }
    
    return {
      decision: selectedOption,
      reasoning: decisionReasoning
    };
  };
  
  /**
   * Helper function to sort players by threat level (for strategic decisions)
   */
  const sortPlayersByThreatLevel = (playerIds: string[], allPlayers: PlayerData[], currentPlayerId: string): string[] => {
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
  const calculateThreatLevel = (player: PlayerData): number => {
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
  const sortPlayersByRelationship = (
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
  const relationshipToScore = (relType: string): number => {
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
  const findAlly = (playerId: string, options: string[], allPlayers: PlayerData[]): string | null => {
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
  const sortPlayersByCompatibility = (playerIds: string[], allPlayers: PlayerData[], currentPlayerId: string): string[] => {
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
  const calculateCompatibility = (player1: PlayerData, player2: PlayerData): number => {
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
   * Generate dialogue for an AI player based on their personality and current situation
   */
  const generateAIDialogue = async (
    playerId: string,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any
  ): Promise<string> => {
    const player = players.find(p => p.id === playerId);
    if (!player) return "I have nothing to say.";
    
    // In a real implementation, this would call an LLM API like OpenAI
    // For now, return template-based responses
    
    const playerMemory = aiMemory[playerId] || [];
    
    switch (situation) {
      case 'nomination':
        return `As Head of Household, I've decided to nominate ${context.nominees.join(' and ')} for eviction.`;
      case 'veto':
        return context.used 
          ? `I've decided to use the Power of Veto on ${context.savedPlayer}.` 
          : "I've decided not to use the Power of Veto this week.";
      case 'eviction':
        return `I vote to evict ${context.evictedPlayer}.`;
      case 'hoh':
        return "I'm honored to be the new Head of Household. This responsibility isn't something I take lightly.";
      case 'reaction':
        return context.isNominated 
          ? "Being nominated isn't ideal, but I'm going to fight to stay in this house." 
          : "I'm relieved to be safe this week, but the game continues.";
      case 'general':
        return "The tension in this house is definitely building. I need to stay focused on my game.";
    }
  };
  
  return {
    aiMemory,
    addMemoryEntry,
    clearAIMemory,
    makeAIDecision,
    generateAIDialogue
  };
}
