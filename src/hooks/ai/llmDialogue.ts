
import { supabase } from '@/integrations/supabase/client';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry } from './types';

/**
 * Generate AI dialogue using the OpenAI API through Supabase Edge Functions
 */
export const generateLLMDialogue = async (
  player: PlayerData,
  situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
  context: any,
  recentMemory: string = ""
): Promise<string> => {
  try {
    console.log("Generating LLM dialogue for:", player.name, "Situation:", situation);
    
    // Prepare the player profile in the format expected by the Edge Function
    const playerProfile = {
      id: player.id,
      name: player.name,
      archetype: player.personality?.archetype || 'floater',
      traits: player.personality?.traits || ['adaptable'],
      personality: player.personality?.background || `A typical ${player.personality?.archetype || 'floater'} contestant`,
      backstory: player.bio || 'No backstory available',
    };
    
    // Convert game phase from situation
    const gamePhaseMap: Record<typeof situation, string> = {
      'nomination': 'Nomination Ceremony',
      'veto': 'Veto Ceremony',
      'eviction': 'Eviction',
      'hoh': 'Head of Household Competition',
      'general': 'General House Activities',
      'reaction': 'Reaction to Game Events'
    };
    
    const gamePhase = gamePhaseMap[situation];
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: {
        playerProfile,
        gamePhase,
        situation,
        recentMemory,
        context
      }
    });
    
    if (error) {
      console.error("Error calling generate-ai-response:", error);
      // Fall back to template dialogue if the API call fails
      return fallbackDialogue(player, situation, context);
    }
    
    return data.generated_text;
  } catch (error) {
    console.error("Error in generateLLMDialogue:", error);
    // Fall back to template dialogue
    return fallbackDialogue(player, situation, context);
  }
};

/**
 * Fallback dialogue generation if the API call fails
 */
const fallbackDialogue = (
  player: PlayerData,
  situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
  context: any
): string => {
  const archetype = player.personality?.archetype || 'floater';
  
  switch (situation) {
    case 'nomination':
      return `As Head of Household, I've nominated ${context.nominees?.join(' and ') || 'the nominees'} for eviction. This is a strategic move for my game.`;
    case 'veto':
      return context.used 
        ? `I've decided to use the Power of Veto on ${context.savedPlayer || 'someone'}. This is the right move for my game.` 
        : "I've decided not to use the Power of Veto this week. My decision is final.";
    case 'eviction':
      return `I vote to evict ${context.evictedPlayer || 'the nominee'}. This is my strategic choice.`;
    case 'hoh':
      return "I'm the new Head of Household, and I'm ready to make some big moves this week.";
    case 'reaction':
      return context.isNominated 
        ? "Being nominated isn't ideal, but I'm going to fight to stay in this game." 
        : "I'm safe this week, which is always my first goal in this game.";
    case 'general':
      return "This game is all about adapting to changing circumstances. I'm focused on my strategy.";
    default:
      return "I'm playing my game one day at a time.";
  }
};
