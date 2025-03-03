
import { PlayerData } from '@/components/PlayerProfileTypes';

/**
 * Generate template-based dialogue for an AI player
 */
export const generateTemplateDialogue = (
  player: PlayerData,
  situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
  context: any
): string => {
  const playerMemory = [];
  
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
    default:
      return "I'm focused on playing my game and seeing where the chips fall.";
  }
};

/**
 * Generate personality-based dialogue using simulated LLM responses
 */
export const generatePersonalityDialogue = async (
  player: PlayerData,
  situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
  context: any,
  recentMemory: string = ""
): Promise<string> => {
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
