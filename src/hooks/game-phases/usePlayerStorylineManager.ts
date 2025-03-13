
import { useState, useCallback, useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useEventDecisionManager } from './decisions/useEventDecisionManager';
import { toast } from '@/components/ui/use-toast';
import { GamePhase } from '@/types/gameTypes';

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  type: 'competition' | 'social' | 'twist' | 'diary' | 'alliance';
  options?: {
    id: string;
    text: string;
    consequence: string;
  }[];
  impact?: number; // How much this event impacts game (-5 to 5)
  requires?: {
    phase?: string;
    playerId?: string;
    relationship?: string;
  };
}

export function usePlayerStorylineManager() {
  // Explicitly type the required properties from GameContext
  const { 
    players, 
    currentWeek,
    addMemoryEntry,
  } = useGameContext();

  // Access these properties from GameContext but with type checking
  const gameContext = useGameContext() as unknown as {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    useAction: () => boolean;
  } & ReturnType<typeof useGameContext>;

  const { currentPhase, dayCount, actionsRemaining, useAction } = gameContext;

  const [currentStoryEvent, setCurrentStoryEvent] = useState<StoryEvent | null>(null);
  const [storyEventOpen, setStoryEventOpen] = useState(false);
  const [storyQueue, setStoryQueue] = useState<StoryEvent[]>([]);
  const [dayEvents, setDayEvents] = useState<string[]>([]);
  const [playerMood, setPlayerMood] = useState<string>('neutral');
  
  // Get decision manager to use its mechanism
  const { 
    presentDecision, 
    handleDecisionMade, 
    currentEvent 
  } = useEventDecisionManager();

  // Clear day events when day changes
  useEffect(() => {
    setDayEvents([]);
  }, [dayCount]);

  // Present an event from the queue
  const presentNextEvent = useCallback(() => {
    if (storyQueue.length > 0 && !currentStoryEvent && !currentEvent) {
      const nextEvent = storyQueue[0];
      setCurrentStoryEvent(nextEvent);
      setStoryEventOpen(true);
      
      // Remove from queue
      setStoryQueue(prev => prev.slice(1));
    }
  }, [storyQueue, currentStoryEvent, currentEvent]);

  // Present next event when conditions are right
  useEffect(() => {
    if (!storyEventOpen && !currentEvent) {
      presentNextEvent();
    }
  }, [storyEventOpen, currentEvent, presentNextEvent]);

  // Trigger a diary room event where player reflects on game
  const triggerDiaryRoomEvent = useCallback(() => {
    // Only allow diary room once per day
    if (dayEvents.includes('diary')) return false;
    
    // Costs an action point
    if (!useAction()) return false;
    
    const getPromptForPhase = () => {
      switch (currentPhase) {
        case 'HoH Competition':
          return "What's your strategy going into this HoH competition?";
        case 'Nomination Ceremony':
          return "Who are you thinking of nominating and why?";
        case 'PoV Competition':
          return "How important is winning the veto to your game right now?";
        case 'Veto Ceremony':
          return "What are your thoughts on how the veto might be used?";
        case 'Eviction Voting':
          return "Who are you planning to vote out and why?";
        default:
          return "How do you feel about your position in the game right now?";
      }
    };
    
    const diaryEvent: StoryEvent = {
      id: `diary_${Date.now()}`,
      title: "Diary Room Confession",
      description: getPromptForPhase(),
      type: 'diary',
      options: [
        { id: 'strategic', text: "Share strategic thoughts", consequence: "Your game moves become more transparent" },
        { id: 'emotional', text: "Express your feelings", consequence: "Your social connections strengthen" },
        { id: 'deceptive', text: "Mislead about your intentions", consequence: "Your game becomes more secretive" }
      ]
    };
    
    setStoryQueue(prev => [...prev, diaryEvent]);
    setDayEvents(prev => [...prev, 'diary']);
    
    return true;
  }, [currentPhase, dayEvents, useAction]);

  // Trigger a social interaction with another player
  const triggerSocialEvent = useCallback((targetPlayerId: string) => {
    // Costs an action point
    if (!useAction()) return false;
    
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) return false;
    
    const socialEvent: StoryEvent = {
      id: `social_${Date.now()}`,
      title: `Conversation with ${targetPlayer.name}`,
      description: `${targetPlayer.name} approaches you for a chat. How do you want to interact?`,
      type: 'social',
      options: [
        { id: 'game', text: "Talk game strategy", consequence: "May form strategic bond" },
        { id: 'personal', text: "Have a personal conversation", consequence: "May form social bond" },
        { id: 'alliance', text: "Propose an alliance", consequence: "May form a new alliance" },
        { id: 'distance', text: "Keep your distance", consequence: "Maintain game separation" }
      ],
      requires: {
        playerId: targetPlayerId
      }
    };
    
    setStoryQueue(prev => [...prev, socialEvent]);
    setDayEvents(prev => [...prev, `social_${targetPlayerId}`]);
    
    return true;
  }, [players, useAction]);

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
      addMemoryEntry(event.requires.playerId, {
        type: event.type === 'social' ? 'conversation' : 'strategy_discussion',
        week: currentWeek || 1,
        description: `In a ${event.type} interaction, the human player chose: ${choice.text}`,
        impact: 'neutral',
        importance: 3,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show consequence as toast
    toast({
      title: "Decision Made",
      description: choice.consequence,
      duration: 3000
    });
    
    // Close the event dialog
    setStoryEventOpen(false);
    setCurrentStoryEvent(null);
  }, [currentStoryEvent, addMemoryEntry, currentWeek]);

  // Generate random house events based on game state
  const generateRandomEvent = useCallback(() => {
    // Limit random events based on actions
    if (actionsRemaining < 2 || dayEvents.length > 3) return false;
    
    // 15% chance of a random event
    if (Math.random() > 0.15) return false;
    
    // Use an action
    if (!useAction()) return false;
    
    // Pick a random event type
    const eventTypes = ['twist', 'social', 'alliance'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Generate the appropriate event
    let newEvent: StoryEvent;
    
    if (eventType === 'twist') {
      const twists = [
        {
          title: "America's Vote",
          description: "The audience has voted on a special power. You've been offered a chance to take it.",
          options: [
            { id: 'accept', text: "Accept the power", consequence: "You gain a special power but become a target" },
            { id: 'reject', text: "Reject the power", consequence: "You stay under the radar" }
          ]
        },
        {
          title: "Luxury Competition",
          description: "A special luxury competition is announced. Will you try hard to win?",
          options: [
            { id: 'try', text: "Give it your all", consequence: "You might win a prize but expend energy" },
            { id: 'conserve', text: "Conserve your energy", consequence: "You save energy for more important competitions" }
          ]
        },
        {
          title: "House Lockdown",
          description: "The house is on lockdown for a special event. How do you spend this time?",
          options: [
            { id: 'socialize', text: "Socialize with houseguests", consequence: "You strengthen social bonds" },
            { id: 'observe', text: "Quietly observe others", consequence: "You gather information about others" },
            { id: 'rest', text: "Rest and recharge", consequence: "You gain energy for upcoming challenges" }
          ]
        }
      ];
      
      const selectedTwist = twists[Math.floor(Math.random() * twists.length)];
      newEvent = {
        id: `twist_${Date.now()}`,
        title: selectedTwist.title,
        description: selectedTwist.description,
        type: 'twist',
        options: selectedTwist.options
      };
    } else if (eventType === 'social') {
      // Pick a random player for a social interaction
      const availablePlayers = players.filter(p => !p.isHuman && !dayEvents.includes(`social_${p.id}`));
      if (availablePlayers.length === 0) return false;
      
      const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      
      newEvent = {
        id: `social_${Date.now()}`,
        title: `${randomPlayer.name} Approaches`,
        description: `${randomPlayer.name} wants to talk with you in private. How do you respond?`,
        type: 'social',
        options: [
          { id: 'engage', text: "Engage in conversation", consequence: "You build rapport with them" },
          { id: 'brief', text: "Keep it brief", consequence: "You maintain distance but stay cordial" },
          { id: 'avoid', text: "Find an excuse to leave", consequence: "You avoid potentially revealing information" }
        ],
        requires: {
          playerId: randomPlayer.id
        }
      };
    } else {
      // Alliance event
      const potentialAllies = players.filter(p => !p.isHuman);
      if (potentialAllies.length < 2) return false;
      
      // Pick 2 random players
      const shuffled = [...potentialAllies].sort(() => 0.5 - Math.random());
      const ally1 = shuffled[0];
      const ally2 = shuffled[1];
      
      newEvent = {
        id: `alliance_${Date.now()}`,
        title: "Alliance Opportunity",
        description: `${ally1.name} and ${ally2.name} are discussing forming an alliance and want you to join. What do you do?`,
        type: 'alliance',
        options: [
          { id: 'join', text: "Join their alliance", consequence: "You gain protection but commit to them" },
          { id: 'counter', text: "Counter with your own alliance proposal", consequence: "You try to take leadership" },
          { id: 'decline', text: "Politely decline", consequence: "You maintain independence but miss an opportunity" }
        ]
      };
    }
    
    // Add to queue
    setStoryQueue(prev => [...prev, newEvent]);
    setDayEvents(prev => [...prev, eventType]);
    
    return true;
  }, [players, actionsRemaining, dayEvents, useAction]);

  return {
    currentStoryEvent,
    storyEventOpen, 
    setStoryEventOpen,
    storyQueue,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    playerMood
  };
}
