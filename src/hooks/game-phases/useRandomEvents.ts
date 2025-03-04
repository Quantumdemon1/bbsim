import { useCallback, useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry } from '@/hooks/ai/types';

export function useRandomEvents() {
  const { 
    players, 
    makeAIDecision, 
    generateAIDialogue,
    addMemoryEntry, // This should now be available from the context
    updateBotEmotion,
    // other context values
  } = useGameContext();
  
  const [lastEventDay, setLastEventDay] = useState(0);
  const [eventProbability, setEventProbability] = useState(0.3); // 30% chance by default
  
  const triggerRandomEvent = useCallback(async (currentDay: number) => {
    // Only trigger events once per day
    if (currentDay <= lastEventDay) return null;
    
    // Random chance to trigger an event
    if (Math.random() > eventProbability) return null;
    
    // Mark this day as having had an event
    setLastEventDay(currentDay);
    
    // Get AI players only
    const aiPlayers = players.filter(p => !p.isHuman && !p.isEvicted);
    if (aiPlayers.length === 0) return null;
    
    // Pick a random AI player to be involved
    const randomPlayer = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
    
    // Pick a random event type
    const eventTypes = ['alliance_offer', 'strategy_discussion', 'secret_reveal', 'game_insight'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Generate event content
    const eventContent = await generateEventContent(randomPlayer, eventType);
    
    // Add to AI memory
    const memoryEntry: AIMemoryEntry = {
      type: 'random_event',
      description: eventContent.summary,
      impact: eventContent.impact,
      importance: 3,
      timestamp: new Date().toISOString()
    };
    
    addMemoryEntry(randomPlayer.id, memoryEntry);
    
    // Update bot emotion based on event
    updateBotEmotion(randomPlayer.id, eventContent.emotion);
    
    return {
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
      eventType,
      content: eventContent.text,
      summary: eventContent.summary
    };
  }, [players, lastEventDay, eventProbability, generateAIDialogue, addMemoryEntry, updateBotEmotion]);
  
  const generateEventContent = async (player: PlayerData, eventType: string) => {
    // Generate appropriate dialogue for the event
    const dialogue = await generateAIDialogue(player.id, 'random_event', { eventType });
    
    // Determine impact and emotion based on event type
    let impact = 'neutral';
    let emotion = 'neutral';
    
    switch (eventType) {
      case 'alliance_offer':
        impact = Math.random() > 0.5 ? 'positive' : 'neutral';
        emotion = impact === 'positive' ? 'excited' : 'thoughtful';
        break;
      case 'strategy_discussion':
        impact = 'neutral';
        emotion = 'focused';
        break;
      case 'secret_reveal':
        impact = Math.random() > 0.7 ? 'negative' : 'neutral';
        emotion = impact === 'negative' ? 'worried' : 'relieved';
        break;
      case 'game_insight':
        impact = 'positive';
        emotion = 'confident';
        break;
    }
    
    // Create a summary of the event
    const summary = `${player.name} ${getEventSummary(eventType)}`;
    
    return {
      text: dialogue,
      summary,
      impact,
      emotion
    };
  };
  
  const getEventSummary = (eventType: string) => {
    switch (eventType) {
      case 'alliance_offer':
        return 'considered forming a new alliance';
      case 'strategy_discussion':
        return 'thought about their game strategy';
      case 'secret_reveal':
        return 'revealed a secret to another houseguest';
      case 'game_insight':
        return 'had an insight about the game dynamics';
      default:
        return 'had a moment of reflection';
    }
  };
  
  const setEventFrequency = (probability: number) => {
    setEventProbability(Math.max(0, Math.min(1, probability)));
  };
  
  return {
    triggerRandomEvent,
    setEventFrequency,
    eventProbability
  };
}
