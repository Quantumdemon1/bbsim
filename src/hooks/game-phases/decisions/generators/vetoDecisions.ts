
import { PlayerData } from '@/components/PlayerProfileTypes';
import { DecisionData } from '../types';

/**
 * Generate veto decision
 */
export const generateVetoDecision = (nominees: string[], hasVeto: boolean, players: PlayerData[]): DecisionData => {
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
