
import { StoryEvent } from '../types';
import { generateStorylineEvent } from '../generators';
import { PlayerData } from '@/components/PlayerProfileTypes';

/**
 * Handles player's choice in a story event
 */
export function handleStoryChoice(
  eventId: string,
  choiceId: string,
  state: {
    currentStoryEvent: StoryEvent | null;
    activeStorylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[];
    completedStorylines: string[];
    storyQueue: StoryEvent[];
  },
  setters: {
    setCurrentStoryEvent: (event: StoryEvent | null) => void;
    setStoryEventOpen: (open: boolean) => void;
    setPlayerMood: (mood: string) => void;
    setActiveStorylines: (storylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[]) => void;
    setCompletedStorylines: (storylines: string[]) => void;
    setStoryQueue: (queue: StoryEvent[]) => void;
  },
  context: {
    currentWeek?: number;
    addMemoryEntry: (playerId: string, entry: any) => void;
    players: PlayerData[];
  },
  generator = generateStorylineEvent
): void {
  const { currentStoryEvent, activeStorylines, completedStorylines, storyQueue } = state;
  
  if (!currentStoryEvent || currentStoryEvent.id !== eventId) {
    console.error('No active event or event ID mismatch');
    return;
  }
  
  // Find the selected choice
  const choice = currentStoryEvent.options?.find(o => o.id === choiceId);
  if (!choice) {
    console.error('Invalid choice ID');
    return;
  }
  
  // Close the event dialog
  setters.setStoryEventOpen(false);
  
  // Adjust player mood based on choice
  if (choice.relationshipEffect) {
    // Positive choices make the player feel better, negative choices might stress them
    if (choice.relationshipEffect > 0) {
      setters.setPlayerMood('positive');
    } else if (choice.relationshipEffect < -2) {
      setters.setPlayerMood('negative');
    }
  }
  
  // Update memory with this event
  const humanPlayer = context.players.find(p => p.isHuman);
  if (humanPlayer) {
    const memoryEntry = {
      type: 'event_choice',
      week: context.currentWeek || 1,
      eventTitle: currentStoryEvent.title,
      eventDesc: currentStoryEvent.description,
      choice: choice.text,
      consequence: choice.consequence,
      importance: choice.memoryImportance || 5,
      date: new Date().toISOString()
    };
    
    context.addMemoryEntry(humanPlayer.id, memoryEntry);
  }
  
  // Handle multi-stage storylines
  if (currentStoryEvent.storylineId) {
    const storylineIndex = activeStorylines.findIndex(
      s => s.storylineId === currentStoryEvent.storylineId
    );
    
    if (storylineIndex !== -1) {
      const storyline = activeStorylines[storylineIndex];
      
      // Update choices made
      if (currentStoryEvent.sequence) {
        const newChoices = {
          ...storyline.choices,
          [currentStoryEvent.sequence]: choiceId
        };
        
        if (currentStoryEvent.isComplete) {
          // Complete this storyline
          const newActiveStorylines = [...activeStorylines];
          newActiveStorylines.splice(storylineIndex, 1);
          setters.setActiveStorylines(newActiveStorylines);
          
          // Add to completed storylines
          const newCompletedStorylines = [
            ...completedStorylines,
            currentStoryEvent.storylineId
          ];
          setters.setCompletedStorylines(newCompletedStorylines);
        } else {
          // Continue this storyline with next sequence
          const nextSequence = (currentStoryEvent.sequence || 1) + 1;
          
          // Generate next event in sequence
          const nextEvent = generator(
            currentStoryEvent.storylineId,
            nextSequence,
            newChoices,
            context.players
          );
          
          if (nextEvent) {
            // Add to queue for later
            const newQueue = [...storyQueue, nextEvent];
            setters.setStoryQueue(newQueue);
            
            // Update active storyline with new sequence and choices
            const newActiveStorylines = [...activeStorylines];
            newActiveStorylines[storylineIndex] = {
              ...storyline,
              currentSequence: nextSequence,
              choices: newChoices
            };
            setters.setActiveStorylines(newActiveStorylines);
          }
        }
      }
    }
  }
  
  // Clear the current event
  setters.setCurrentStoryEvent(null);
  
  // If this choice leads to another event, add it to queue
  if (choice.nextEventId) {
    // This would need to generate the next event based on ID
    // For now we'll just log it
    console.log('Next event triggered:', choice.nextEventId);
    // Here you would generate the next event and add it to the queue
  }
}
