
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision } from '../types';

/**
 * Generate a decision using OpenAI API (currently simulated)
 */
export const generateLLMDecision = async (
  player: PlayerData,
  decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
  options: string[],
  players: PlayerData[],
  memory: any[]
): Promise<AIPlayerDecision> => {
  // Get player memory
  const recentMemory = memory.slice(-5).map(m => m.description).join("; ");
  
  // Get option names instead of IDs for better context
  const optionNames = options.map(id => {
    const optionPlayer = players.find(p => p.id === id);
    return optionPlayer ? optionPlayer.name : id;
  });

  // Construct a prompt for the LLM (would be sent to API in production)
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
      week: 1, // This would come from gameState in a real implementation
      phase: "unknown" // This would come from gameState in a real implementation
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
