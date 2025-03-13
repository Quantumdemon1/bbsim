
import { StoryEvent } from '../types';
import { toast } from '@/components/ui/use-toast';

/**
 * Handles player's choice in a story event
 */
export function handleStoryChoice(
  eventId: string, 
  choiceId: string,
  state: {
    currentStoryEvent: StoryEvent | null,
    activeStorylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[],
    completedStorylines: string[],
    storyQueue: StoryEvent[]
  },
  setters: {
    setCurrentStoryEvent: (event: StoryEvent | null) => void,
    setStoryEventOpen: (open: boolean) => void,
    setPlayerMood: (mood: string) => void,
    setActiveStorylines: (storylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[]) => void,
    setCompletedStorylines: (storylines: string[]) => void,
    setStoryQueue: (queue: StoryEvent[]) => void
  },
  context: {
    currentWeek?: number,
    addMemoryEntry: (playerId: string, entry: any) => void,
    players: any[]
  },
  generateStorylineEvent: (storylineId: string, sequence: number, choices: Record<number, string>, players: any[]) => StoryEvent | null
) {
  const event = state.currentStoryEvent;
  if (!event) return;
  
  const choice = event.options?.find(o => o.id === choiceId);
  if (!choice) return;
  
  // Update player mood based on the choice
  if (choiceId === 'strategic') setters.setPlayerMood('focused');
  if (choiceId === 'emotional') setters.setPlayerMood('expressive'); 
  if (choiceId === 'deceptive') setters.setPlayerMood('cunning');
  
  // Record the choice for AI memory if related to a specific player
  if (event.requires?.playerId) {
    // Create a more detailed memory entry
    context.addMemoryEntry(event.requires.playerId, {
      type: event.type === 'social' ? 'conversation' : 'strategy_discussion',
      week: context.currentWeek || 1,
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
    const isActiveStoryline = state.activeStorylines.some(s => s.storylineId === event.storylineId);
    
    if (isActiveStoryline) {
      // Update the active storyline with this choice
      const updatedStorylines = state.activeStorylines.map(storyline => {
        if (storyline.storylineId === event.storylineId) {
          const updatedChoices = {
            ...storyline.choices,
            [event.sequence || 1]: choiceId
          };
          
          // If the event is marked as complete, move to completed storylines
          if (event.isComplete) {
            setters.setCompletedStorylines([...state.completedStorylines, event.storylineId]);
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
      
      setters.setActiveStorylines(updatedStorylines);
      
      // Generate the next event in the storyline if not complete
      if (!event.isComplete && choice.nextEventId) {
        const currentStoryline = state.activeStorylines.find(s => s.storylineId === event.storylineId);
        
        if (currentStoryline) {
          const nextSequence = (event.sequence || 1) + 1;
          const nextEvent = generateStorylineEvent(
            event.storylineId,
            nextSequence,
            {
              ...currentStoryline.choices,
              [event.sequence || 1]: choiceId
            },
            context.players
          );
          
          if (nextEvent) {
            const newQueue = [...state.storyQueue, nextEvent];
            setters.setStoryQueue(newQueue);
          }
        }
      }
    }
  } else if (choice.nextEventId) {
    // Handle branching for non-storyline events
    // This would be implemented in the future
  }
  
  // Close the event dialog
  setters.setStoryEventOpen(false);
  setters.setCurrentStoryEvent(null);
}
