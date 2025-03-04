
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useAIPlayerContext } from '@/hooks/gameContext/useAIPlayerContext';

interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  consequence?: string;
}

export interface DecisionData {
  title: string;
  description: string;
  situation: string;
  options: DecisionOption[];
  targetPlayerId?: string;
}

interface UsePlayerDecisionsProps {
  players: PlayerData[];
  currentPlayerId: string | null;
}

export function usePlayerDecisions({ players, currentPlayerId }: UsePlayerDecisionsProps) {
  const [isDecisionPromptOpen, setIsDecisionPromptOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<DecisionData | null>(null);
  const [pendingDecisionCallback, setPendingDecisionCallback] = useState<((optionId: string) => void) | null>(null);
  const { toast } = useToast();
  const { generateAIDialogue, isThinking } = useAIPlayerContext();
  
  // Present a decision to the player
  const presentDecision = async (
    decisionData: DecisionData,
    onDecisionMade: (optionId: string) => void
  ) => {
    setCurrentDecision(decisionData);
    setPendingDecisionCallback(() => onDecisionMade);
    setIsDecisionPromptOpen(true);
  };
  
  // Handle the player making a decision
  const handleDecisionMade = (optionId: string) => {
    if (pendingDecisionCallback) {
      pendingDecisionCallback(optionId);
      
      // Get the selected option
      const selectedOption = currentDecision?.options.find(o => o.id === optionId);
      
      if (selectedOption) {
        toast({
          title: "Decision Made",
          description: `You chose: ${selectedOption.label}`,
        });
      }
      
      // Reset decision state
      setCurrentDecision(null);
      setPendingDecisionCallback(null);
    }
  };
  
  // Generate alliance decision
  const generateAllianceDecision = async (targetPlayerId: string): Promise<DecisionData> => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    
    if (!targetPlayer) {
      throw new Error(`Player with ID ${targetPlayerId} not found`);
    }
    
    const options: DecisionOption[] = [
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
    const options: DecisionOption[] = eligiblePlayers.map(player => ({
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
    const options: DecisionOption[] = nominees.map(nomineeId => {
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
    let options: DecisionOption[] = [
      {
        id: 'no_veto',
        label: "Do Not Use the Veto",
        description: "Keep the nominations the same"
      }
    ];
    
    // If player has veto power, add options to use it
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
    isDecisionPromptOpen,
    setIsDecisionPromptOpen,
    currentDecision,
    presentDecision,
    handleDecisionMade,
    generateAllianceDecision,
    generateNominationDecision,
    generateEvictionVoteDecision,
    generateVetoDecision
  };
}
