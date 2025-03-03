
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
      } else if (archetype === 'comp-beast') {
        return `As HoH, I've nominated ${context.nominees.join(' and ')}. This is simply a competitive game move, and I respect you both as competitors. May the best player stay in the house.`;
      } else if (archetype === 'underdog') {
        return `I never thought I'd be in this position of power, but I've nominated ${context.nominees.join(' and ')}. This house has shown me that I need to make tough decisions to survive.`;
      } else {
        return `As Head of Household, I've nominated ${context.nominees.join(' and ')}. This decision was based on what I think is best for my game right now.`;
      }
    
    case 'veto':
      if (context.used) {
        if (archetype === 'social-butterfly') {
          return `I've decided to use the Power of Veto on ${context.savedPlayer}. I know this might upset some people, but I have to follow my heart on this one.`;
        } else if (archetype === 'mastermind') {
          return `After analyzing all possible outcomes, I'm using the Power of Veto on ${context.savedPlayer}. This move creates the optimal game position for me moving forward.`;
        } else if (archetype === 'villain') {
          return `I'm using the Power of Veto on ${context.savedPlayer}. Let's see how the house handles this twist - chaos always reveals people's true colors.`;
        } else if (archetype === 'comp-beast') {
          return `I earned this Veto through hard work, and I'm using it on ${context.savedPlayer}. That's what this game is about - winning comps and making power moves.`;
        } else {
          return `I've decided to use the Power of Veto on ${context.savedPlayer}. This move makes the most sense for my game strategy at this moment.`;
        }
      } else {
        if (archetype === 'mastermind') {
          return "After weighing all the options, I've decided not to use the Power of Veto this week. Sometimes the best move is to maintain the status quo.";
        } else if (archetype === 'social-butterfly') {
          return "I've decided not to use the Veto today. This was such a difficult decision because I care about everyone in this house, but I have to trust that this is the right choice.";
        } else if (archetype === 'villain') {
          return "I'm keeping the nominations exactly as they are. The Power of Veto stays in its box this week - sometimes it's more entertaining to watch things play out without interference.";
        } else if (archetype === 'comp-beast') {
          return "I won this Veto fair and square, and I've decided not to use it. The nominations are fine as they are, and that's my final decision.";
        } else if (archetype === 'underdog') {
          return "I've chosen not to use the Veto. I know what it's like to be on the block, but I need to make decisions that help my own game too.";
        } else {
          return "I've decided not to use the Power of Veto. This was a difficult decision, but I believe it's the right one for my game right now.";
        }
      }
    
    case 'eviction':
      if (traits.includes('loyal') || traits.includes('trustworthy')) {
        return `I vote to evict ${context.evictedPlayer}. I've always said I would be loyal to my allies, and this vote reflects that commitment.`;
      } else if (traits.includes('strategic') || traits.includes('calculated')) {
        return `I vote to evict ${context.evictedPlayer}. This decision advances my position in the game and eliminates a potential threat.`;
      } else if (traits.includes('emotional') || traits.includes('passionate')) {
        return `I vote to evict ${context.evictedPlayer}. This isn't easy, but I have to follow my gut feeling on this one.`;
      } else if (archetype === 'villain') {
        return `I vote to evict ${context.evictedPlayer}. Let's be honest - they were never going to make it to the end anyway.`;
      } else if (archetype === 'social-butterfly') {
        return `With a heavy heart, I vote to evict ${context.evictedPlayer}. This game forces us to make choices that affect real people, and that's never easy.`;
      } else {
        return `I vote to evict ${context.evictedPlayer}. At this point in the game, this is the choice I need to make.`;
      }
    
    case 'hoh':
      if (archetype === 'comp-beast') {
        return "Winning HoH was my goal this week, and I'm thrilled to have pulled it off. Now it's time to make some power moves and shake up this house.";
      } else if (archetype === 'social-butterfly') {
        return "I'm so excited to be HoH this week! It's a huge responsibility, but I'm looking forward to the private room and getting those precious letters from home!";
      } else if (archetype === 'mastermind') {
        return "Securing HoH this week was crucial to my strategy. Now I can execute the next phase of my game plan and control the nominations exactly as I need to.";
      } else if (archetype === 'underdog') {
        return "I can't believe I won HoH! After being on the bottom for so long, it feels amazing to finally have some power in this game. The tables have turned.";
      } else if (archetype === 'villain') {
        return "Well, look who's in charge now. As the new Head of Household, I'll be making decisions that some of you won't like. That's just how the game works.";
      } else if (traits.includes('humble')) {
        return "I'm grateful to be Head of Household this week. I know this power is temporary, and I'll try to use it wisely while I have it.";
      } else {
        return "Becoming Head of Household is a big responsibility, and I plan to use this power wisely. This week will definitely be interesting.";
      }
    
    case 'reaction':
      if (context.isNominated) {
        if (archetype === 'mastermind') {
          return "Being on the block is obviously not ideal, but I'm not worried. I've been planning for this possibility, and I have moves to make.";
        } else if (archetype === 'comp-beast') {
          return "I've been nominated, which means I need to win the veto. Simple as that. I've won competitions before, and I'll do it again when it matters most.";
        } else if (archetype === 'social-butterfly') {
          return "Being nominated hurts because I've tried to build genuine connections with everyone. But I'll continue to be myself and hope that people see my value in this house.";
        } else if (archetype === 'villain') {
          return "So I'm on the block? Interesting choice. I hope whoever put me here is prepared for the consequences if this doesn't work out for them.";
        } else if (archetype === 'underdog') {
          return "I'm not surprised to be nominated again. This game has been an uphill battle for me from day one, but I'm not giving up. I never give up.";
        } else if (traits.includes('emotional')) {
          return "I can't believe I'm on the block. This is really tough, but I'm going to fight with everything I have to stay in this house.";
        } else if (traits.includes('resilient')) {
          return "Being nominated is just another challenge to overcome. I've faced worse outside this house, and I'll face this head-on too.";
        } else {
          return "So I'm nominated... it's disappointing but not surprising. This game is full of twists, and I'm ready to compete for my safety.";
        }
      } else {
        if (traits.includes('paranoid')) {
          return "I'm safe this week, but I can't get comfortable. I know my name is probably being thrown around for next week already.";
        } else if (traits.includes('confident')) {
          return "Not being nominated was expected. My social game has been on point, and people know I'm valuable to have around.";
        } else if (archetype === 'mastermind') {
          return "Staying off the block was according to plan. Now I can work behind the scenes to ensure my targets are the ones in danger.";
        } else if (archetype === 'social-butterfly') {
          return "I'm so relieved not to be nominated! But I feel terrible for those who were - this game is such an emotional rollercoaster for everyone.";
        } else if (traits.includes('grateful')) {
          return "I'm thankful to be safe for another week. In this game, you can never take safety for granted.";
        } else {
          return "I'm safe for another week, which is always the first goal. Now I need to position myself better for what's coming next.";
        }
      }
    
    case 'general':
      if (archetype === 'social-butterfly') {
        return "The relationships in this house are so complicated! I'm trying to stay positive and keep everyone's spirits up despite all the game tension.";
      } else if (archetype === 'villain') {
        return "People are playing scared, and that's never a winning strategy. I came here to make big moves, not hide in the shadows.";
      } else if (archetype === 'mastermind') {
        return "I'm constantly observing how people interact in this house. Every conversation, every reaction gives me information I can use to advance my strategy.";
      } else if (archetype === 'comp-beast') {
        return "I'm just waiting for the next competition. That's where I shine, and that's how I'll ensure my safety week after week.";
      } else if (archetype === 'underdog') {
        return "This game hasn't been easy for me, but I'm still here. I've been underestimated my whole life, and I always prove people wrong.";
      } else if (traits.includes('observant')) {
        return "I've been watching the dynamics shift in the house. The alliances are becoming more obvious to those paying attention.";
      } else if (traits.includes('humorous')) {
        return "You've got to laugh to keep from crying in this house! The drama is real, but I'm trying to keep things light when I can.";
      } else if (traits.includes('strategic')) {
        return "Every decision in this house is a calculated risk. I'm constantly weighing my options and planning my next move carefully.";
      } else {
        return "This game is constantly evolving, and you have to adapt. I'm just trying to stay aware of where I stand with everyone.";
      }
    
    default:
      return "I'm focused on playing my game and seeing where the chips fall.";
  }
};

