
import { useAIPlayerContext as useAIPlayer } from '../../contexts/AIPlayerContext';

export function useAIPlayerContext() {
  const aiPlayer = useAIPlayer();
  
  return {
    // AI Player
    makeAIDecision: aiPlayer.makeAIDecision,
    generateAIDialogue: aiPlayer.generateAIDialogue,
    addMemoryEntry: aiPlayer.addMemoryEntry,
    clearAIMemory: aiPlayer.clearAIMemory,
    getPlayerMemory: aiPlayer.getPlayerMemory,
    isUsingLLM: aiPlayer.isUsingLLM,
    toggleLLMDecisionMaking: aiPlayer.toggleLLMDecisionMaking,
    isThinking: aiPlayer.isThinking,
    botEmotions: aiPlayer.botEmotions,
    updateBotEmotion: aiPlayer.updateBotEmotion,
  };
}
