
import { useState, useCallback } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { useRandomEvents, GameEvent } from './useRandomEvents';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from './usePlayerDecisions';
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook that provides unified management of random events and player decisions
 * Integrates with both game phases and AI context
 */
export function useEventDecisionManager() {
  const { players, currentWeek, generateAIDialogue, addMemoryEntry, updateBotEmotion } = useGameContext();
  const { toast } = useToast();
  
  // Event handling state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  // Decision handling state
  const [decisionPromptOpen, setDecisionPromptOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<DecisionData | null>(null);
  const [pendingDecisionCallback, setPendingDecisionCallback] = useState<((optionId: string) => void) | null>(null);
  
  // Initialize random events hook
  const {
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents,
    triggerRandomEvent
  } = useRandomEvents();
  
  // Handle an event choice
  const handleEventChoice = (eventId: string, choiceId: string) => {
    const result = processEventChoice(eventId, choiceId);
    if (result) {
      console.log("Event outcome:", result.outcome);
      console.log("Relationship effects:", result.relationshipEffect);
      
      // Create a memory entry for this event choice
      const event = weeklyEvents.find(e => e.id === eventId);
      if (event) {
        const player = players.find(p => p.id === event.playerId);
        if (player) {
          const memoryEntry = {
            type: 'random_event',
            week: currentWeek || 1,
            description: `${player.name} ${result.outcome}`,
            impact: choiceId === 'positive' ? 'positive' : choiceId === 'negative' ? 'negative' : 'neutral',
            importance: 3,
            timestamp: new Date().toISOString()
          };
          
          addMemoryEntry(event.playerId, memoryEntry);
          
          // Update bot emotion based on the choice
          const emotions = {
            positive: 'happy',
            neutral: 'neutral',
            negative: 'disappointed'
          };
          updateBotEmotion(event.playerId, emotions[choiceId as keyof typeof emotions]);
        }
      }
      
      // Close the event modal
      setEventModalOpen(false);
      setCurrentEvent(null);
    }
  };
  
  // Handle a random event
  const handleRandomEvent = async () => {
    const newEvent = await generateRandomEvent(players, currentWeek || 1);
    if (newEvent) {
      setCurrentEvent(newEvent);
      setEventModalOpen(true);
    }
  };
  
  // Present a decision to the player
  const presentDecision = (
    decisionData: DecisionData,
    onDecisionMade: (optionId: string) => void
  ) => {
    setCurrentDecision(decisionData);
    setPendingDecisionCallback(() => onDecisionMade);
    setDecisionPromptOpen(true);
    return new Promise<string>((resolve) => {
      setPendingDecisionCallback((optionId) => {
        onDecisionMade(optionId);
        resolve(optionId);
        return optionId;
      });
    });
  };
  
  // Handle the player making a decision
  const handleDecisionMade = (optionId: string) => {
    if (pendingDecisionCallback && currentDecision) {
      pendingDecisionCallback(optionId);
      
      // Get the selected option
      const selectedOption = currentDecision.options.find(o => o.id === optionId);
      
      if (selectedOption) {
        toast({
          title: "Decision Made",
          description: `You chose: ${selectedOption.label}`,
        });
        
        // Create a memory entry for target player if applicable
        if (currentDecision.targetPlayerId) {
          const memoryEntry = {
            type: 'player_decision',
            week: currentWeek || 1,
            description: `The human player chose: ${selectedOption.label}`,
            impact: 'neutral',
            importance: 4,
            timestamp: new Date().toISOString()
          };
          
          addMemoryEntry(currentDecision.targetPlayerId, memoryEntry);
        }
      }
      
      // Reset decision state
      setCurrentDecision(null);
      setPendingDecisionCallback(null);
    }
  };
  
  // Generate various decision types
  const generateAllianceDecision = async (targetPlayerId: string): Promise<DecisionData> => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    
    if (!targetPlayer) {
      throw new Error(`Player with ID ${targetPlayerId} not found`);
    }
    
    const options = [
      {
        id: 'propose_alliance',
        label: "Propose an Alliance",
        description: "Suggest working together to further both your games"
      },
      {
        id: 'casual_chat',
        label: "Just Have a Casual Chat",
        description: "Keep things light and build a social connection"
      },
      {
        id: 'share_information',
        label: "Share Information",
        description: "Tell them something you know about another player"
      },
      {
        id: 'distance_yourself',
        label: "Keep Your Distance",
        description: "Be polite but don't commit to anything"
      }
    ];
    
    return {
      title: `Interaction with ${targetPlayer.name}`,
      description: `${targetPlayer.name} wants to talk game with you. How do you want to respond?`,
      situation: 'alliance',
      options,
      targetPlayerId
    };
  };
  
  // Generate nomination decision
  const generateNominationDecision = (eligiblePlayers: PlayerData[]): DecisionData => {
    const options = eligiblePlayers.map(player => ({
      id: player.id,
      label: `Nominate ${player.name}`,
      description: player.personality?.archetype 
        ? `The ${player.personality.archetype} player` 
        : undefined
    }));
    
    return {
      title: "Nomination Decision",
      description: "As Head of Household, you must nominate two houseguests for eviction. Choose your first nominee.",
      situation: 'nomination',
      options
    };
  };
  
  // Generate eviction vote decision
  const generateEvictionVoteDecision = (nominees: string[]): DecisionData => {
    const options = nominees.map(nomineeId => {
      const nominee = players.find(p => p.id === nomineeId);
      return {
        id: nomineeId,
        label: `Vote to Evict ${nominee?.name}`,
        description: nominee?.personality?.archetype 
          ? `The ${nominee.personality.archetype} player` 
          : undefined
      };
    });
    
    return {
      title: "Eviction Vote",
      description: "It's time to vote. Which houseguest do you want to evict from the Big Brother house?",
      situation: 'eviction',
      options
    };
  };
  
  // Generate veto decision
  const generateVetoDecision = (nominees: string[], hasVeto: boolean): DecisionData => {
    let options = [
      {
        id: 'no_veto',
        label: "Do Not Use the Veto",
        description: "Keep the nominations the same"
      }
    ];
    
    if (hasVeto) {
      nominees.forEach(nomineeId => {
        const nominee = players.find(p => p.id === nomineeId);
        options.push({
          id: `veto_${nomineeId}`,
          label: `Use Veto on ${nominee?.name}`,
          description: `Remove ${nominee?.name} from the block`
        });
      });
    }
    
    return {
      title: "Power of Veto Decision",
      description: hasVeto 
        ? "You won the Power of Veto! Do you want to use it to save one of the nominees?" 
        : "The Power of Veto ceremony is about to begin.",
      situation: 'veto',
      options
    };
  };
  
  return {
    // Random Events
    weeklyEvents,
    currentEvent,
    eventModalOpen,
    setEventModalOpen,
    handleRandomEvent,
    handleEventChoice,
    triggerRandomEvent,
    resetWeeklyEvents,
    
    // Player Decisions
    currentDecision,
    decisionPromptOpen,
    setDecisionPromptOpen,
    presentDecision,
    handleDecisionMade,
    generateAllianceDecision,
    generateNominationDecision,
    generateEvictionVoteDecision,
    generateVetoDecision
  };
}
