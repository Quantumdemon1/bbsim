
import { supabase } from '@/integrations/supabase/client';
import { AIMemoryEntry, AIPlayerDecision, AIPlayerAttributes, PlayerArchetype, PersonalityTrait } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes } from '@/hooks/game-phases/types/player';
import { getDefaultEmotion } from './memory/memoryUtils';
import { Database } from '@/integrations/supabase/types';

type AIMemoryDbEntry = Database['public']['Tables']['ai_memory_entries']['Row'];

/**
 * Service for interacting with AI player data in Supabase
 */
export const AIPlayerService = {
  /**
   * Get all AI player profiles from the database
   */
  async getAllProfiles(): Promise<PlayerData[]> {
    const { data, error } = await supabase
      .from('ai_player_profiles')
      .select('*');
    
    if (error) {
      console.error("Error fetching AI profiles:", error);
      return [];
    }
    
    // Convert Supabase data to PlayerData format
    return data.map(profile => {
      // Make sure archetype value is valid for PlayerData
      let archetype = profile.archetype as PlayerArchetype;
      if (archetype === 'underdog') {
        archetype = 'social-butterfly'; // Default fallback
      }

      return {
        id: profile.id,
        name: profile.name,
        isAI: true,
        personality: {
          archetype: archetype as "mastermind" | "social-butterfly" | "comp-beast" | "floater" | "villain",
          traits: Array.isArray(profile.traits) ? profile.traits as PersonalityTrait[] : [],
          background: profile.personality,
          motivation: profile.backstory
        },
        attributes: {
          general: 3, // Default value
          physical: profile.competition_skill || 3,
          mental: 3, // Default value
          mentalQuiz: profile.strategic_skill || 3,
          social: profile.social_skill || 3,
          loyalty: profile.loyalty || 3,
          strategic: profile.strategic_skill || 3,
          adaptability: 3,
          risk: 3,
          leadership: 3,
          temperament: 3,
          deception: 3,
          endurance: 3,
          independence: 3
        }
      };
    });
  },
  
  /**
   * Get all memory entries for a specific player
   */
  async getPlayerMemory(playerId: string): Promise<AIMemoryEntry[]> {
    const { data, error } = await supabase
      .from('ai_memory_entries')
      .select('*')
      .eq('player_id', playerId)
      .order('timestamp', { ascending: false })
      .limit(30); // Increased from 20 to 30
    
    if (error) {
      console.error("Error fetching player memory:", error);
      return [];
    }
    
    // Convert database entries to AIMemoryEntry format
    return data.map(entry => ({
      description: entry.description,
      importance: entry.importance || 3,
      type: entry.type,
      impact: entry.impact as 'positive' | 'negative' | 'neutral',
      player_id: entry.player_id || playerId,
      relatedPlayerId: entry.related_player_id,
      week: entry.week,
      id: entry.id,
      timestamp: entry.timestamp || new Date().toISOString(),
      emotion: getDefaultEmotion(entry.impact as 'positive' | 'negative' | 'neutral'),
      decayFactor: (entry.importance || 3) / 5
    })) as AIMemoryEntry[];
  },
  
  /**
   * Add a memory entry for a player
   */
  async addMemoryEntry(entry: AIMemoryEntry): Promise<void> {
    // Ensure timestamp is a string for Supabase
    const timestamp = typeof entry.timestamp === 'number' 
      ? new Date(entry.timestamp).toISOString() 
      : entry.timestamp;

    const { error } = await supabase
      .from('ai_memory_entries')
      .insert([{
        description: entry.description,
        player_id: entry.player_id,
        related_player_id: entry.relatedPlayerId,
        impact: entry.impact,
        importance: entry.importance,
        type: entry.type,
        week: entry.week,
        timestamp: timestamp || new Date().toISOString(),
      }]);
    
    if (error) {
      console.error("Error adding memory entry:", error);
    }
  },
  
  /**
   * Update the game state
   */
  async updateGameState(gameState: any): Promise<void> {
    const { error } = await supabase
      .from('game_states')
      .upsert([gameState]);
    
    if (error) {
      console.error("Error updating game state:", error);
    }
  }
};
