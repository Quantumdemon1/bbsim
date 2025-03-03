
import { supabase } from '@/integrations/supabase/client';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision, AIMemoryEntry } from '../types';
import { toast } from '@/components/ui/use-toast';

/**
 * Generate a decision using OpenAI API through Supabase Edge Functions
 */
export const generateLLMDecision = async (
  player: PlayerData,
  decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
  options: string[],
  allPlayers: PlayerData[],
  memory: AIMemoryEntry[]
): Promise<AIPlayerDecision> => {
  try {
    console.log("Generating LLM decision for:", player.name, "Decision type:", decisionType);
    
    // Get player memory
    const recentMemory = memory.slice(-5).map(m => m.description).join("; ");
    
    // Get option names instead of IDs for better context
    const optionPlayers = options.map(id => {
      const player = allPlayers.find(p => p.id === id);
      return player ? {
        id: player.id,
        name: player.name,
        archetype: player.personality?.archetype || 'floater',
        traits: player.personality?.traits || ['adaptable'],
        relationship: player.relationships?.find(r => r.playerId === player.id)?.type || 'Neutral'
      } : { id, name: id };
    });

    // Prepare the player profile in the format expected by the Edge Function
    const playerProfile = {
      id: player.id,
      name: player.name,
      archetype: player.personality?.archetype || 'floater',
      traits: player.personality?.traits || ['adaptable'],
      personality: player.personality?.background || `A typical ${player.personality?.archetype || 'floater'} contestant`,
      backstory: player.personality?.motivation || 'No backstory available',
      attributes: player.attributes || {
        physical: 3,
        strategic: 3,
        social: 3,
        loyalty: 3
      }
    };
    
    // Prepare game context for the decision
    const gameContext = {
      decisionType,
      options: optionPlayers,
      week: 1, // This should come from the actual game state
      phase: decisionType
    };
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: {
        playerProfile,
        gameContext,
        recentMemory,
        responseType: 'decision'
      }
    });
    
    if (error) {
      console.error("Error calling generate-ai-response for decision:", error);
      // Fall back to rule-based decision if the API call fails
      return fallbackDecision(player, decisionType, options, allPlayers);
    }
    
    // Parse the decision from the response
    const { selectedOption, reasoning } = data;
    
    // Find the matching option ID
    const selectedId = selectedOption ? options.find(id => {
      const player = allPlayers.find(p => p.id === id);
      return player && player.name === selectedOption;
    }) : null;
    
    return {
      decision: selectedId || selectedOption || options[0] || null,
      reasoning: reasoning || `${player.name} made a strategic decision.`
    };
  } catch (error) {
    console.error("Error in generateLLMDecision:", error);
    // Fall back to rule-based decision
    return fallbackDecision(player, decisionType, options, allPlayers);
  }
};

/**
 * Fallback decision if the API call fails
 */
const fallbackDecision = (
  player: PlayerData,
  decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
  options: string[],
  allPlayers: PlayerData[]
): AIPlayerDecision => {
  // Simple fallback logic
  const selectedOption = options.length > 0 ? options[0] : null;
  let reasoning = "";
  
  switch (decisionType) {
    case 'nominate':
      reasoning = "I'm nominating based on what's best for my game.";
      break;
    case 'vote':
      reasoning = "I'm voting based on strategy and loyalty.";
      break;
    case 'veto':
      reasoning = "I'm making my veto decision based on my position in the game.";
      break;
    case 'alliance':
      reasoning = "I'm choosing alliance partners who complement my gameplay.";
      break;
    default:
      reasoning = "I'm making this decision based on what's best for my game.";
  }
  
  return {
    decision: selectedOption,
    reasoning
  };
};
