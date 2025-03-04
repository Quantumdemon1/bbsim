
import { useState, useCallback } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useAIPlayerContext } from '@/hooks/gameContext/useAIPlayerContext';

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  participants: string[];
  type: 'conflict' | 'alliance' | 'social' | 'game_talk' | 'house_event';
  impact: 'major' | 'minor' | 'neutral';
  choices?: {
    id: string;
    text: string;
    outcome: string;
    relationshipEffect?: {
      playerId: string;
      change: number;
    }[];
  }[];
};

interface UseRandomEventsProps {
  players: PlayerData[];
  currentPlayerId: string | null;
  week: number;
}

export function useRandomEvents({ players, currentPlayerId, week }: UseRandomEventsProps) {
  const [weeklyEvents, setWeeklyEvents] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const { generateAIDialogue, addMemoryEntry } = useAIPlayerContext();
  
  // Generate a random event
  const generateRandomEvent = useCallback(async () => {
    // Filter out players who are no longer in the game
    const activePlayers = players.filter(p => p.status !== 'evicted' && p.id !== currentPlayerId);
    
    if (activePlayers.length < 2) {
      return null;
    }
    
    // Randomly select event type
    const eventTypes = ['conflict', 'alliance', 'social', 'game_talk', 'house_event'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as GameEvent['type'];
    
    // Select random players
    const numParticipants = randomType === 'house_event' ? 
      Math.min(activePlayers.length, 4) : 
      Math.min(activePlayers.length, 2);
    
    const shuffledPlayers = [...activePlayers].sort(() => 0.5 - Math.random());
    const participants = shuffledPlayers.slice(0, numParticipants).map(p => p.id);
    
    // Generate event content based on type
    let eventTitle = '';
    let eventDesc = '';
    let choices = [];
    
    switch (randomType) {
      case 'conflict':
        const player1 = players.find(p => p.id === participants[0]);
        const player2 = players.find(p => p.id === participants[1]);
        eventTitle = `Conflict in the House`;
        eventDesc = await generateAIDialogue(participants[0], 'reaction', {
          situation: 'conflict',
          otherPlayerId: participants[1],
          week
        });
        
        choices = [
          {
            id: 'mediate',
            text: 'Try to mediate the conflict',
            outcome: 'You step in to calm things down.',
            relationshipEffect: [
              { playerId: participants[0], change: 1 },
              { playerId: participants[1], change: 1 }
            ]
          },
          {
            id: 'side_with_player1',
            text: `Take ${player1?.name}'s side`,
            outcome: `You defend ${player1?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: 2 },
              { playerId: participants[1], change: -2 }
            ]
          },
          {
            id: 'side_with_player2',
            text: `Take ${player2?.name}'s side`,
            outcome: `You defend ${player2?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: -2 },
              { playerId: participants[1], change: 2 }
            ]
          },
          {
            id: 'stay_out',
            text: 'Stay out of it',
            outcome: 'You decide not to get involved.',
            relationshipEffect: []
          }
        ];
        break;
        
      case 'alliance':
        const allyPlayer = players.find(p => p.id === participants[0]);
        eventTitle = `Alliance Opportunity`;
        eventDesc = await generateAIDialogue(participants[0], 'general', {
          situation: 'alliance_proposal',
          targetId: currentPlayerId,
          week
        });
        
        choices = [
          {
            id: 'accept_alliance',
            text: 'Accept the alliance',
            outcome: `You form an alliance with ${allyPlayer?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: 3 }
            ]
          },
          {
            id: 'tentative',
            text: 'Be tentative but open',
            outcome: 'You express interest but remain noncommittal.',
            relationshipEffect: [
              { playerId: participants[0], change: 1 }
            ]
          },
          {
            id: 'decline',
            text: 'Politely decline',
            outcome: `You politely decline ${allyPlayer?.name}'s offer.`,
            relationshipEffect: [
              { playerId: participants[0], change: -1 }
            ]
          },
          {
            id: 'fake_accept',
            text: 'Pretend to accept (but actually lie)',
            outcome: 'You pretend to be interested while planning to betray them.',
            relationshipEffect: [
              { playerId: participants[0], change: 2 }
            ]
          }
        ];
        break;
        
      case 'social':
        const socialPlayer = players.find(p => p.id === participants[0]);
        eventTitle = `Social Interaction`;
        eventDesc = await generateAIDialogue(participants[0], 'general', {
          situation: 'casual_conversation',
          targetId: currentPlayerId,
          week
        });
        
        choices = [
          {
            id: 'open_up',
            text: 'Share something personal',
            outcome: `You open up to ${socialPlayer?.name}, forming a connection.`,
            relationshipEffect: [
              { playerId: participants[0], change: 2 }
            ]
          },
          {
            id: 'light_chat',
            text: 'Keep the conversation light',
            outcome: `You have a pleasant chat with ${socialPlayer?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: 1 }
            ]
          },
          {
            id: 'game_talk',
            text: 'Steer toward game talk',
            outcome: `You discuss strategy with ${socialPlayer?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: 0 }
            ]
          },
          {
            id: 'excuse',
            text: 'Make an excuse to leave',
            outcome: `You politely excuse yourself from the conversation.`,
            relationshipEffect: [
              { playerId: participants[0], change: -1 }
            ]
          }
        ];
        break;
        
      case 'game_talk':
        const strategyPlayer = players.find(p => p.id === participants[0]);
        eventTitle = `Strategy Discussion`;
        eventDesc = await generateAIDialogue(participants[0], 'general', {
          situation: 'strategy_discussion',
          targetId: currentPlayerId,
          week,
          hoh: players.find(p => p.status === 'hoh')?.id
        });
        
        choices = [
          {
            id: 'share_info',
            text: 'Share your strategy',
            outcome: `You discuss your game plan with ${strategyPlayer?.name}.`,
            relationshipEffect: [
              { playerId: participants[0], change: 2 }
            ]
          },
          {
            id: 'listen',
            text: 'Listen but reveal little',
            outcome: `You let ${strategyPlayer?.name} talk while keeping your thoughts private.`,
            relationshipEffect: [
              { playerId: participants[0], change: 0 }
            ]
          },
          {
            id: 'mislead',
            text: 'Mislead about your intentions',
            outcome: `You intentionally mislead ${strategyPlayer?.name} about your plans.`,
            relationshipEffect: [
              { playerId: participants[0], change: -1 }
            ]
          },
          {
            id: 'change_subject',
            text: 'Change the subject',
            outcome: `You steer the conversation away from game talk.`,
            relationshipEffect: [
              { playerId: participants[0], change: -1 }
            ]
          }
        ];
        break;
        
      case 'house_event':
        eventTitle = `House Event`;
        eventDesc = `Several houseguests are ${['cooking together', 'playing a game', 'working out', 'sharing stories'][Math.floor(Math.random() * 4)]}. ${participants.length > 0 ? `${players.find(p => p.id === participants[0])?.name} invites you to join them.` : ''}`;
        
        choices = [
          {
            id: 'join_enthusiastically',
            text: 'Join enthusiastically',
            outcome: 'You dive in and have a great time with the group.',
            relationshipEffect: participants.map(id => ({ playerId: id, change: 2 }))
          },
          {
            id: 'join_casually',
            text: 'Join casually',
            outcome: 'You participate in a relaxed way.',
            relationshipEffect: participants.map(id => ({ playerId: id, change: 1 }))
          },
          {
            id: 'watch',
            text: 'Watch from a distance',
            outcome: 'You observe the group dynamics from afar.',
            relationshipEffect: participants.map(id => ({ playerId: id, change: 0 }))
          },
          {
            id: 'decline_event',
            text: 'Decline to participate',
            outcome: 'You choose to do your own thing instead.',
            relationshipEffect: participants.map(id => ({ playerId: id, change: -1 }))
          }
        ];
        break;
    }
    
    const newEvent: GameEvent = {
      id: `event_${Date.now()}`,
      title: eventTitle,
      description: eventDesc,
      participants,
      type: randomType,
      impact: Math.random() > 0.7 ? 'major' : (Math.random() > 0.5 ? 'minor' : 'neutral'),
      choices
    };
    
    // Add to weekly events
    setWeeklyEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, [players, currentPlayerId, week, generateAIDialogue, addMemoryEntry]);
  
  // Process the player's choice in an event
  const processEventChoice = useCallback((eventId: string, choiceId: string) => {
    const event = weeklyEvents.find(e => e.id === eventId);
    if (!event || !event.choices) return null;
    
    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return null;
    
    // Return the outcome and relationship effects
    return {
      outcome: choice.outcome,
      relationshipEffect: choice.relationshipEffect || []
    };
  }, [weeklyEvents]);
  
  // Reset events for a new week
  const resetWeeklyEvents = useCallback(() => {
    setWeeklyEvents([]);
    setCurrentEvent(null);
  }, []);
  
  return {
    weeklyEvents,
    currentEvent,
    setCurrentEvent,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  };
}
