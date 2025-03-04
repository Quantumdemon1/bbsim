
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from '../types';

/**
 * Generate alliance decision
 */
export const generateAllianceDecision = (targetPlayerId: string, players: PlayerData[]): DecisionData => {
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
