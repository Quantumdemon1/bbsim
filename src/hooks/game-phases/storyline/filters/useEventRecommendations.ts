
import { useCallback, useMemo } from 'react';
import { StoryEvent } from '../types';
import { getCategoryForEventType } from '../constants/eventCategories';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhase } from '@/types/gameTypes';

/**
 * Hook for event recommendations based on game state
 */
export function useEventRecommendations() {
  // Get recommended events for the current game state
  const getRecommendedEvents = useCallback((
    events: StoryEvent[],
    currentPhase: GamePhase,
    players: PlayerData[],
    playerMood: string,
    dayCount: number,
    nominees: string[] = [],
    hoh: string | null = null
  ) => {
    // Define weights for different factors
    const weights = {
      phase: 3,      // Phase relevance weight
      mood: 2,       // Player mood match weight
      urgency: 3,    // Game situation urgency weight
      relationship: 2 // Relationship relevance weight
    };

    // Score each event
    const scoredEvents = events.map(event => {
      let score = 0;
      
      // Phase relevance
      const phaseFrequency = event.frequency?.find(f => f.phase === currentPhase);
      if (phaseFrequency) {
        score += phaseFrequency.probability * 10 * weights.phase;
      }
      
      // Mood matching
      if (event.type === 'diary' && playerMood === 'negative') {
        // Diary events are good for processing negative emotions
        score += 5 * weights.mood;
      } else if (event.type === 'social' && playerMood === 'positive') {
        // Social events benefit from positive mood
        score += 5 * weights.mood;
      }
      
      // Game situation urgency
      const humanPlayer = players.find(p => p.isHuman);
      if (humanPlayer) {
        if (nominees.includes(humanPlayer.id) && event.type === 'strategy') {
          // Strategy events more important when nominated
          score += 8 * weights.urgency;
        }
        
        if (hoh === humanPlayer.id && event.type === 'alliance') {
          // Alliance events more important when HoH
          score += 7 * weights.urgency;
        }
      }
      
      // Relationship relevance
      if (event.requires?.playerId) {
        const targetPlayer = players.find(p => p.id === event.requires?.playerId);
        if (targetPlayer) {
          // Higher score for players with stronger relationships
          const relationship = targetPlayer.relationships?.find(
            r => r.playerId === event.requires?.playerId
          );
          
          if (relationship) {
            const relationshipScore = relationship.type === 'Ally' ? 5 :
                                      relationship.type === 'Friend' ? 4 :
                                      relationship.type === 'Enemy' ? 3 :
                                      relationship.type === 'Target' ? 3 : 1;
            
            score += relationshipScore * weights.relationship;
          }
        }
      }
      
      return { event, score };
    });
    
    // Sort by score and return top events
    return scoredEvents
      .sort((a, b) => b.score - a.score)
      .map(item => item.event);
  }, []);

  // Get events that are specifically relevant to a player's situation
  const getContextualEvents = useCallback((
    events: StoryEvent[],
    players: PlayerData[],
    nominees: string[] = [],
    hoh: string | null = null
  ) => {
    // Find human player
    const humanPlayer = players.find(p => p.isHuman);
    if (!humanPlayer) return [];
    
    // Contextual filters
    return events.filter(event => {
      // If player is nominated, prioritize strategy and alliance events
      if (nominees.includes(humanPlayer.id)) {
        const category = getCategoryForEventType(event.type).id;
        if (category === 'strategy' || category === 'alliance') {
          return true;
        }
      }
      
      // If player is HoH, prioritize power and decision events
      if (hoh === humanPlayer.id) {
        const category = getCategoryForEventType(event.type).id;
        if (category === 'strategy' || category === 'twist') {
          return true;
        }
      }
      
      // If event involves a nominated player
      if (event.requires?.playerId && nominees.includes(event.requires.playerId)) {
        return true;
      }
      
      return false;
    });
  }, []);

  return {
    getRecommendedEvents,
    getContextualEvents
  };
}
