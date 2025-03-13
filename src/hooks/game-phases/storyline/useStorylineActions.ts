
import { useCallback } from 'react';
import { StoryEvent, StorylineState } from './types';
import { 
  createDiaryRoomEvent, 
  createSocialEvent, 
  generateRandomGameEvent,
  generateStorylineEvent
} from './eventGenerators';
import { toast } from '@/components/ui/use-toast';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { v4 as uuidv4 } from 'uuid';

export function useStorylineActions(
  storyState: StorylineState,
  stateSetters: {
    setCurrentStoryEvent: (event: StoryEvent | null) => void;
    setStoryEventOpen: (open: boolean) => void;
    setStoryQueue: (queue: StoryEvent[]) => void;
    setDayEvents: (events: string[]) => void;
    setPlayerMood: (mood: string) => void;
    setCompletedStorylines: (storylines: string[]) => void;
    setActiveStorylines: (storylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[]) => void;
  },
  context: {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    players: PlayerData[];
    currentWeek?: number;
    useAction: () => boolean;
    addMemoryEntry: (playerId: string, entry: any) => void;
    alliances?: Alliance[];
    nominees?: string[];
    hoh?: string | null;
  }
) {
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents,
    completedStorylines, activeStorylines
  } = storyState;
  
  const {
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, 
    setDayEvents, setPlayerMood, setCompletedStorylines, setActiveStorylines
  } = stateSetters;
  
  const {
    currentPhase, dayCount, players, useAction, addMemoryEntry, 
    currentWeek, alliances = [], nominees = [], hoh = null
  } = context;

  // Present next event from the queue
  const presentNextEvent = useCallback(() => {
    if (storyQueue.length > 0 && !currentStoryEvent) {
      const nextEvent = storyQueue[0];
      setCurrentStoryEvent(nextEvent);
      setStoryEventOpen(true);
      
      // Remove from queue
      const newQueue = storyQueue.slice(1);
      setStoryQueue(newQueue);
    }
  }, [storyQueue, currentStoryEvent, setCurrentStoryEvent, setStoryEventOpen, setStoryQueue]);

  // Trigger a diary room event
  const triggerDiaryRoomEvent = useCallback(() => {
    // Only allow diary room once per day
    if (dayEvents.includes('diary')) return false;
    
    // Costs an action point
    if (!useAction()) return false;
    
    const diaryEvent = createDiaryRoomEvent(currentPhase);
    
    const newQueue = [...storyQueue, diaryEvent];
    setStoryQueue(newQueue);
    
    const newDayEvents = [...dayEvents, 'diary'];
    setDayEvents(newDayEvents);
    
    return true;
  }, [currentPhase, dayEvents, useAction, storyQueue, setStoryQueue, setDayEvents]);

  // Trigger a social interaction with another player
  const triggerSocialEvent = useCallback((targetPlayerId: string) => {
    // Costs an action point
    if (!useAction()) return false;
    
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) return false;
    
    // Get relationship with target player
    const relationship = targetPlayer.relationships?.find(r => 
      r.playerId === targetPlayerId
    )?.type || 'Neutral';
    
    const socialEvent = createSocialEvent(targetPlayer, relationship, alliances);
    
    const newQueue = [...storyQueue, socialEvent];
    setStoryQueue(newQueue);
    
    const newDayEvents = [...dayEvents, `social_${targetPlayerId}`];
    setDayEvents(newDayEvents);
    
    return true;
  }, [players, useAction, storyQueue, dayEvents, setStoryQueue, setDayEvents, alliances]);

  // Handle player's choice in an event
  const handleStoryChoice = useCallback((eventId: string, choiceId: string) => {
    const event = currentStoryEvent;
    if (!event) return;
    
    const choice = event.options?.find(o => o.id === choiceId);
    if (!choice) return;
    
    // Update player mood based on the choice
    if (choiceId === 'strategic') setPlayerMood('focused');
    if (choiceId === 'emotional') setPlayerMood('expressive'); 
    if (choiceId === 'deceptive') setPlayerMood('cunning');
    
    // Record the choice for AI memory if related to a specific player
    if (event.requires?.playerId) {
      // Create a more detailed memory entry
      addMemoryEntry(event.requires.playerId, {
        type: event.type === 'social' ? 'conversation' : 'strategy_discussion',
        week: currentWeek || 1,
        description: `In a ${event.type} interaction about "${event.title}", the human player chose: ${choice.text}`,
        impact: choice.relationshipEffect && choice.relationshipEffect > 0 ? 'positive' : 
               choice.relationshipEffect && choice.relationshipEffect < 0 ? 'negative' : 'neutral',
        importance: choice.memoryImportance || 5,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show consequence as toast
    toast({
      title: "Decision Made",
      description: choice.consequence,
      duration: 3000
    });
    
    // Check if this is part of a storyline
    if (event.storylineId) {
      // Handle multi-stage storylines
      const isActiveStoryline = activeStorylines.some(s => s.storylineId === event.storylineId);
      
      if (isActiveStoryline) {
        // Update the active storyline with this choice
        const updatedStorylines = activeStorylines.map(storyline => {
          if (storyline.storylineId === event.storylineId) {
            const updatedChoices = {
              ...storyline.choices,
              [event.sequence || 1]: choiceId
            };
            
            // If the event is marked as complete, move to completed storylines
            if (event.isComplete) {
              setCompletedStorylines([...completedStorylines, event.storylineId]);
              return null; // This will be filtered out
            }
            
            return {
              ...storyline,
              currentSequence: (event.sequence || 1) + 1,
              choices: updatedChoices
            };
          }
          return storyline;
        }).filter(Boolean) as {
          storylineId: string;
          currentSequence: number;
          choices: Record<number, string>;
        }[];
        
        setActiveStorylines(updatedStorylines);
        
        // Generate the next event in the storyline if not complete
        if (!event.isComplete && choice.nextEventId) {
          const currentStoryline = activeStorylines.find(s => s.storylineId === event.storylineId);
          
          if (currentStoryline) {
            const nextSequence = (event.sequence || 1) + 1;
            const nextEvent = generateStorylineEvent(
              event.storylineId,
              nextSequence,
              {
                ...currentStoryline.choices,
                [event.sequence || 1]: choiceId
              },
              players
            );
            
            if (nextEvent) {
              const newQueue = [...storyQueue, nextEvent];
              setStoryQueue(newQueue);
            }
          }
        }
      }
    } else if (choice.nextEventId) {
      // Handle branching for non-storyline events
      // Here we could generate a follow-up event based on the choice
      // This would be implemented in the future
    }
    
    // Close the event dialog
    setStoryEventOpen(false);
    setCurrentStoryEvent(null);
  }, [
    currentStoryEvent, 
    setStoryEventOpen, 
    setCurrentStoryEvent, 
    setPlayerMood, 
    addMemoryEntry, 
    currentWeek, 
    activeStorylines,
    completedStorylines,
    setCompletedStorylines,
    setActiveStorylines,
    players,
    storyQueue,
    setStoryQueue
  ]);

  // Start a new storyline
  const startStoryline = useCallback((storylineId: string) => {
    // Check if already active or completed
    if (
      activeStorylines.some(s => s.storylineId === storylineId) ||
      completedStorylines.includes(storylineId)
    ) {
      return false;
    }
    
    // Generate the first event in the storyline
    const firstEvent = generateStorylineEvent(storylineId, 1, {}, players);
    if (!firstEvent) return false;
    
    // Add to queue
    const newQueue = [...storyQueue, firstEvent];
    setStoryQueue(newQueue);
    
    // Add to active storylines
    const newActiveStorylines = [
      ...activeStorylines,
      {
        storylineId,
        currentSequence: 1,
        choices: {}
      }
    ];
    setActiveStorylines(newActiveStorylines);
    
    return true;
  }, [
    activeStorylines,
    completedStorylines,
    players,
    storyQueue,
    setStoryQueue,
    setActiveStorylines
  ]);

  // Generate random house events based on game state
  const generateRandomEvent = useCallback(() => {
    // Limit random events based on actions
    if (context.actionsRemaining < 2 || dayEvents.length > 3) return false;
    
    // Check active storylines first (priority)
    const storylinesToProgress = activeStorylines.filter(s => {
      // Don't progress more than one stage per day
      return !dayEvents.includes(`storyline_${s.storylineId}`);
    });
    
    if (storylinesToProgress.length > 0) {
      // Random chance to progress a storyline (50%)
      if (Math.random() < 0.5) {
        const randomStoryline = storylinesToProgress[
          Math.floor(Math.random() * storylinesToProgress.length)
        ];
        
        const nextEvent = generateStorylineEvent(
          randomStoryline.storylineId,
          randomStoryline.currentSequence,
          randomStoryline.choices,
          players
        );
        
        if (nextEvent) {
          // Use an action
          if (!useAction()) return false;
          
          // Add to queue
          const newQueue = [...storyQueue, nextEvent];
          setStoryQueue(newQueue);
          
          const newDayEvents = [...dayEvents, `storyline_${randomStoryline.storylineId}`];
          setDayEvents(newDayEvents);
          
          return true;
        }
      }
    }
    
    // Chance to start a new storyline if none active (15%)
    if (activeStorylines.length === 0 && Math.random() < 0.15) {
      const storylineOptions = ['alliance_betrayal', 'power_struggle', 'secret_mission'];
      const availableStorylines = storylineOptions.filter(s => !completedStorylines.includes(s));
      
      if (availableStorylines.length > 0) {
        const newStorylineId = availableStorylines[
          Math.floor(Math.random() * availableStorylines.length)
        ];
        
        if (startStoryline(newStorylineId)) {
          if (!useAction()) return false;
          
          const newDayEvents = [...dayEvents, `storyline_${newStorylineId}`];
          setDayEvents(newDayEvents);
          
          return true;
        }
      }
    }
    
    // 15% chance of a regular random event if no storyline progressed
    if (Math.random() > 0.15) return false;
    
    // Use an action
    if (!useAction()) return false;
    
    const newEvent = generateRandomGameEvent(
      players, 
      currentPhase, 
      dayCount, 
      storyState.playerMood, 
      alliances, 
      nominees, 
      hoh
    );
    
    if (!newEvent) return false;
    
    // Add to queue
    const newQueue = [...storyQueue, newEvent];
    setStoryQueue(newQueue);
    
    const newDayEvents = [...dayEvents, newEvent.type];
    setDayEvents(newDayEvents);
    
    return true;
  }, [
    context.actionsRemaining, 
    dayEvents, 
    useAction, 
    players, 
    storyQueue, 
    setStoryQueue, 
    setDayEvents,
    currentPhase,
    dayCount,
    storyState.playerMood,
    alliances,
    nominees,
    hoh,
    activeStorylines,
    completedStorylines,
    startStoryline
  ]);

  return {
    presentNextEvent,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    startStoryline
  };
}
