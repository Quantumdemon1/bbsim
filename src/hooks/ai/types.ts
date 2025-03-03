
/**
 * AI Player attributes extend the basic player attributes with more detailed personality traits
 */
export interface AIPlayerAttributes {
  // Competition abilities
  physical: number;      // Physical competition skills (1-5)
  endurance: number;     // Ability to handle endurance comps (1-5)
  mentalQuiz: number;    // Quiz/memory competition skills (1-5)
  
  // Strategic abilities
  strategic: number;     // Overall strategic thinking (1-5)
  adaptability: number;  // Adapting to changing circumstances (1-5)
  risk: number;          // Willingness to take risks (1-5)
  
  // Social abilities
  social: number;        // Social game/charm (1-5)
  leadership: number;    // Leadership qualities (1-5)
  temperament: number;   // Temperament/emotional control (1-5)
  
  // Personality traits
  loyalty: number;       // Loyalty to alliances (1-5)
  deception: number;     // Willingness to deceive (1-5)
  independence: number;  // Independence vs. group-oriented (1-5)
}

/**
 * Memory entry for storing game events and interactions
 */
export interface AIMemoryEntry {
  type: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'alliance' | 'betrayal' | 'conversation' | 
        'competition_win' | 'competition_loss' | 'argument' | 'celebration' | 'strategy_discussion' | 'private_conversation';
  week: number;
  description: string;
  relatedPlayerId?: string;  // Other player involved in this memory
  impact: 'positive' | 'negative' | 'neutral';
  importance: number;        // 1-5 scale of how important this memory is
  timestamp: number;         // When this memory was created
}

/**
 * Result of AI decision-making process
 */
export interface AIPlayerDecision {
  decision: string | null;   // The ID of the selected option or null
  reasoning: string;         // Explanation of the decision (for logging/UI)
}

/**
 * Player relationship types
 */
export type RelationshipType = 'Enemy' | 'Rival' | 'Neutral' | 'Friend' | 'Ally';

