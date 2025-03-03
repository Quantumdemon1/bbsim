
import { useAllianceContext as useAlliance } from '../../contexts/AllianceContext';

export function useAllianceContext() {
  const alliance = useAlliance();
  
  return {
    // Alliance
    alliances: alliance.alliances,
    setAlliances: alliance.setAlliances,
    createAlliance: alliance.createAlliance,
    addToAlliance: alliance.addToAlliance,
    removeFromAlliance: alliance.removeFromAlliance,
  };
}
