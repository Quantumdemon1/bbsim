
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry, AIPlayerAttributes, AIPlayerDecision } from './types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to manage AI player behavior and decision-making
 */
export function useAIPlayerManager(players: PlayerData[]) {
  // Store AI player memory (game events, interactions, etc.)
  const [aiMemory, setAIMemory] = useState<Record<string, AIMemoryEntry[]>>({});
  const [isUsingLLM, setIsUsingLLM] = useState<boolean>(false);
  const { toast } = useToast();
  
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
   * Toggle LLM-based decision making
   */
  const toggleLLMDecisionMaking = () => {
    setIsUsingLLM(prev => !prev);
    toast({
      title: isUsingLLM ? "LLM Decision Making Disabled" : "LLM Decision Making Enabled",
      description: isUsingLLM 
        ? "AI players will now use rule-based decisions" 
        : "AI players will now use LLM for more realistic decisions",
    });
  };
  
  /**
   * Make a strategic decision for an AI player based on their personality and memory
   */
  const makeAIDecision = async (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ): Promise<AIPlayerDecision> => {
    const player = players.find(p => p.id === playerId);
    if (!player) {
      console.error(`AI player ${playerId} not found`);
      return { 
        decision: options[0] || null,
        reasoning: "Default decision due to player not found"
      };
    }
    
    // If LLM decisions are enabled, use OpenAI to generate a decision
    if (isUsingLLM) {
      try {
        return await generateLLMDecision(player, decisionType, options, gameState);
      } catch (error) {
        console.error("Error generating LLM decision:", error);
        toast({
          title: "LLM Decision Failed",
          description: "Falling back to rule-based decisions.",
          variant: "destructive"
        });
        // Fall back to rule-based decision making if LLM fails
      }
    }
    
    // Rule-based decision making (existing code)
    // Get player attributes (or use defaults if not set)
    const attributes = player.attributes || {
      physical: 3,
      strategic: 3,
      social: 3,
      loyalty: 3,
      general: 3
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
   * Generate a decision using OpenAI API
   */
  const generateLLMDecision = async (
    player: PlayerData,
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ): Promise<AIPlayerDecision> => {
    // Get player memory
    const memory = aiMemory[player.id] || [];
    const recentMemory = memory.slice(-5).map(m => m.description).join("; ");
    
    // Get option names instead of IDs for better context
    const optionNames = options.map(id => {
      const optionPlayer = players.find(p => p.id === id);
      return optionPlayer ? optionPlayer.name : id;
    });

    // Construct a prompt for the LLM
    const prompt = {
      player: {
        name: player.name,
        personality: player.personality || { 
          archetype: 'floater',
          traits: ['adaptable']
        },
        relationships: player.relationships || [],
        recentMemory
      },
      decisionType,
      options: optionNames,
      gameState: {
        week: gameState.week || 1,
        phase: gameState.phase || "unknown"
      }
    };

    console.log("Generating LLM decision for:", player.name, "Decision type:", decisionType);
    console.log("Options:", optionNames);

    // Simulate LLM response for now
    // In a real implementation, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Mock LLM response based on player personality
    const personality = player.personality?.archetype || 'floater';
    
    // Map option back to player ID
    let selectedName: string;
    let reasoning: string;
    
    switch (decisionType) {
      case 'nominate':
        if (personality === 'mastermind') {
          selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
          reasoning = `After careful analysis, I've decided to nominate ${selectedName} as they pose the biggest long-term threat to my game.`;
        } else if (personality === 'social-butterfly') {
          selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
          reasoning = `I need to nominate ${selectedName} because they haven't been connecting with the house socially.`;
        } else {
          selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
          reasoning = `I'm nominating ${selectedName} because it seems like the safest option for my game right now.`;
        }
        break;
      
      case 'vote':
        selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
        reasoning = `I'm voting to evict ${selectedName} because they're the bigger threat to my game strategy.`;
        break;
      
      case 'veto':
        if (Math.random() > 0.5) {
          selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
          reasoning = `I'm using the veto on ${selectedName} because it aligns with my current game position.`;
        } else {
          selectedName = "";
          reasoning = "I've decided not to use the veto this week as it's the best move for my game.";
        }
        break;
      
      case 'alliance':
        selectedName = optionNames[Math.floor(Math.random() * optionNames.length)];
        reasoning = `I want to form an alliance with ${selectedName} because we complement each other's strengths.`;
        break;
        
      default:
        selectedName = optionNames[0] || "";
        reasoning = "I'm making this decision based on what's best for my game.";
    }
    
    // Convert selected name back to ID
    const selectedOption = options.find(id => {
      const player = players.find(p => p.id === id);
      return player && player.name === selectedName;
    }) || options[0] || null;
    
    return {
      decision: selectedOption,
      reasoning
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
    
    // If LLM is enabled, generate more natural dialogue
    if (isUsingLLM) {
      return await generateLLMDialogue(player, situation, context);
    }
    
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

  /**
   * Generate dialogue using LLM (OpenAI simulation for now)
   */
  const generateLLMDialogue = async (
    player: PlayerData,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any
  ): Promise<string> => {
    // Get player memory and personality for context
    const memory = aiMemory[player.id] || [];
    const recentMemory = memory.slice(-3).map(m => m.description).join("; ");
    
    const archetype = player.personality?.archetype || 'floater';
    const traits = player.personality?.traits || ['adaptable'];
    
    console.log("Generating LLM dialogue for:", player.name, "Situation:", situation);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate more natural, personality-based responses
    switch (situation) {
      case 'nomination':
        if (archetype === 'mastermind') {
          return `This wasn't an easy decision, but as Head of Household, I've nominated ${context.nominees.join(' and ')}. In this game, you have to make strategic moves, and I believe this is the right one for my game.`;
        } else if (archetype === 'social-butterfly') {
          return `I hate having to do this, but I've nominated ${context.nominees.join(' and ')}. This isn't personal at all - it's just part of the game, and I hope you both understand that.`;
        } else if (archetype === 'villain') {
          return `After careful consideration, I've decided to nominate ${context.nominees.join(' and ')}. You two haven't been playing the game I respect, so now you need to fight for your place here.`;
        } else {
          return `As Head of Household, I've nominated ${context.nominees.join(' and ')}. This decision was based on what I think is best for my game right now.`;
        }
      
      case 'veto':
        if (context.used) {
          return `I've decided to use the Power of Veto on ${context.savedPlayer}. This move makes the most sense for my game strategy at this moment.`;
        } else {
          if (archetype === 'mastermind') {
            return "After weighing all the options, I've decided not to use the Power of Veto this week. Sometimes the best move is to maintain the status quo.";
          } else {
            return "I've decided not to use the Power of Veto. This was a difficult decision, but I believe it's the right one for my game right now.";
          }
        }
      
      case 'eviction':
        return `I vote to evict ${context.evictedPlayer}. At this point in the game, this is the choice I need to make.`;
      
      case 'hoh':
        if (archetype === 'comp-beast') {
          return "Winning HoH was my goal this week, and I'm thrilled to have pulled it off. Now it's time to make some power moves and shake up this house.";
        } else if (archetype === 'social-butterfly') {
          return "I'm so excited to be HoH this week! It's a huge responsibility, but I'm looking forward to the private room and getting those precious letters from home!";
        } else {
          return "Becoming Head of Household is a big responsibility, and I plan to use this power wisely. This week will definitely be interesting.";
        }
      
      case 'reaction':
        if (context.isNominated) {
          if (archetype === 'mastermind') {
            return "Being on the block is obviously not ideal, but I'm not worried. I've been planning for this possibility, and I have moves to make.";
          } else if (traits.includes('emotional')) {
            return "I can't believe I'm on the block. This is really tough, but I'm going to fight with everything I have to stay in this house.";
          } else {
            return "So I'm nominated... it's disappointing but not surprising. This game is full of twists, and I'm ready to compete for my safety.";
          }
        } else {
          return "I'm safe for another week, which is always the first goal. Now I need to position myself better for what's coming next.";
        }
      
      case 'general':
        if (archetype === 'social-butterfly') {
          return "The relationships in this house are so complicated! I'm trying to stay positive and keep everyone's spirits up despite all the game tension.";
        } else if (archetype === 'villain') {
          return "People are playing scared, and that's never a winning strategy. I came here to make big moves, not hide in the shadows.";
        } else {
          return "This game is constantly evolving, and you have to adapt. I'm just trying to stay aware of where I stand with everyone.";
        }
      
      default:
        return "I'm focused on playing my game and seeing where the chips fall.";
    }
  };
  
  return {
    aiMemory,
    addMemoryEntry,
    clearAIMemory,
    makeAIDecision,
    generateAIDialogue,
    isUsingLLM,
    toggleLLMDecisionMaking
  };
}
