
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from './types';

/**
 * Hook to provide decision generation functions
 */
export function useDecisionGenerators() {
  
  /**
   * Generate alliance decision
   */
  const generateAllianceDecision = (targetPlayerId: string, players: PlayerData[]): DecisionData => {
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
  
  /**
   * Generate nomination decision
   */
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
  
  /**
   * Generate eviction vote decision
   */
  const generateEvictionVoteDecision = (nominees: string[], players: PlayerData[]): DecisionData => {
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
  
  /**
   * Generate veto decision
   */
  const generateVetoDecision = (nominees: string[], hasVeto: boolean, players: PlayerData[]): DecisionData => {
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
    generateAllianceDecision,
    generateNominationDecision,
    generateEvictionVoteDecision,
    generateVetoDecision
  };
}
