import { useCallback, useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry } from '@/hooks/ai/types';

// Define a GameEvent type to export
export interface GameEvent {
  id: string;
  playerId: string;
  playerName: string;
  type: string;
  title: string;
  description: string;
  choices?: { id: string; text: string; outcome: string }[];
  participants: string[];
}

export function useRandomEvents() {
  const { 
    players, 
    makeAIDecision, 
    generateAIDialogue,
    addMemoryEntry,
    updateBotEmotion,
    currentWeek
  } = useGameContext();
  
  const [lastEventDay, setLastEventDay] = useState(0);
  const [eventProbability, setEventProbability] = useState(0.3); // 30% chance by default
  const [weeklyEvents, setWeeklyEvents] = useState<GameEvent[]>([]);
  
  const triggerRandomEvent = useCallback(async (currentDay: number) => {
    // Only trigger events once per day
    if (currentDay <= lastEventDay) return null;
    
    // Random chance to trigger an event
    if (Math.random() > eventProbability) return null;
    
    // Mark this day as having had an event
    setLastEventDay(currentDay);
    
    // Get AI players only (filter out evicted players)
    const aiPlayers = players.filter(p => !p.isHuman && p.status !== 'evicted');
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
      type: "strategy_discussion", // Changed from 'random_event' to a valid type
      description: eventContent.summary,
      impact: eventContent.impact as "neutral" | "positive" | "negative", // Add proper type assertion
      importance: 3,
      timestamp: new Date().toISOString(),
      week: currentWeek || 1 // Add the missing week property
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
  }, [players, lastEventDay, eventProbability, generateAIDialogue, addMemoryEntry, updateBotEmotion, currentWeek]);
  
  const generateEventContent = async (player: PlayerData, eventType: string) => {
    // Generate appropriate dialogue for the event - use 'general' instead of 'random_event'
    const dialogue = await generateAIDialogue(player.id, 'general', { eventType });
    
    // Determine impact and emotion based on event type
    let impact: "neutral" | "positive" | "negative" = "neutral";
    let emotion = 'neutral';
    
    switch (eventType) {
      case 'alliance_offer':
        impact = Math.random() > 0.5 ? "positive" : "neutral";
        emotion = impact === 'positive' ? 'excited' : 'thoughtful';
        break;
      case 'strategy_discussion':
        impact = "neutral";
        emotion = 'focused';
        break;
      case 'secret_reveal':
        impact = Math.random() > 0.7 ? "negative" : "neutral";
        emotion = impact === 'negative' ? 'worried' : 'relieved';
        break;
      case 'game_insight':
        impact = "positive";
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
  
  // Add these functions to match what's being used in GamePhaseDisplay
  const generateRandomEvent = async (): Promise<GameEvent | null> => {
    // Generate a unique ID for the event
    const eventId = Math.random().toString(36).substring(2, 9);
    
    // Get random AI player
    const aiPlayers = players.filter(p => !p.isHuman && p.status !== 'evicted');
    if (aiPlayers.length === 0) return null;
    
    const randomPlayer = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
    
    // Create random event
    const eventTypes = ['alliance_offer', 'strategy_discussion', 'secret_reveal', 'game_insight'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newEvent: GameEvent = {
      id: eventId,
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
      type: eventType,
      title: `${randomPlayer.name} wants to talk...`,
      description: `${randomPlayer.name} ${getEventSummary(eventType)}`,
      participants: [randomPlayer.id],
      choices: [
        { id: 'positive', text: 'React positively', outcome: 'You strengthen your relationship' },
        { id: 'neutral', text: 'Stay neutral', outcome: 'Your relationship stays the same' },
        { id: 'negative', text: 'React negatively', outcome: 'Your relationship weakens' }
      ]
    };
    
    // Add to weekly events
    setWeeklyEvents(prev => [...prev, newEvent]);
    
    return newEvent;
  };
  
  const processEventChoice = (eventId: string, choiceId: string) => {
    // Find the event
    const event = weeklyEvents.find(e => e.id === eventId);
    if (!event) return null;
    
    // Process the outcome (this would affect relationships in a real implementation)
    return {
      outcome: event.choices?.find(c => c.id === choiceId)?.outcome || 'No effect',
      relationshipEffect: choiceId === 'positive' ? 10 : choiceId === 'negative' ? -10 : 0
    };
  };
  
  const resetWeeklyEvents = () => {
    setWeeklyEvents([]);
    setLastEventDay(0);
  };
  
  const setEventFrequency = (probability: number) => {
    setEventProbability(Math.max(0, Math.min(1, probability)));
  };
  
  return {
    triggerRandomEvent,
    setEventFrequency,
    eventProbability,
    // Add new functions to match what GamePhaseDisplay expects
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  };
}
