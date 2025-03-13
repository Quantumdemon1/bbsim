
import React from 'react';
import { GamePhase } from '@/types/gameTypes';
import { Sun, Moon, Award, Shield, Gavel, Users, Zap } from 'lucide-react';

interface EnvironmentIndicatorProps {
  currentPhase: GamePhase;
}

const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ currentPhase }) => {
  // Define colors and icons for different game phases
  const getPhaseDetails = () => {
    switch (currentPhase) {
      case 'HoH Competition':
        return {
          bgColor: 'bg-yellow-500/10',
          icon: <Award className="text-yellow-500 opacity-20 w-32 h-32" />,
          description: 'The energy is competitive as houseguests vie for power'
        };
      case 'Nomination Ceremony':
        return {
          bgColor: 'bg-red-500/10',
          icon: <Gavel className="text-red-500 opacity-20 w-32 h-32" />,
          description: 'Tension fills the air as nominations are decided'
        };
      case 'PoV Competition':
        return {
          bgColor: 'bg-purple-500/10',
          icon: <Shield className="text-purple-500 opacity-20 w-32 h-32" />,
          description: 'A chance for safety creates desperate competition'
        };
      case 'Veto Ceremony':
        return {
          bgColor: 'bg-green-500/10',
          icon: <Zap className="text-green-500 opacity-20 w-32 h-32" />,
          description: 'The power of veto brings hope and dread'
        };
      case 'Eviction Voting':
        return {
          bgColor: 'bg-blue-500/10',
          icon: <Users className="text-blue-500 opacity-20 w-32 h-32" />,
          description: 'The house is somber as someone will leave'
        };
      default:
        return {
          bgColor: 'bg-gray-500/10',
          icon: currentPhase.includes('night') ? 
            <Moon className="text-blue-300 opacity-20 w-32 h-32" /> : 
            <Sun className="text-orange-300 opacity-20 w-32 h-32" />,
          description: 'Daily life continues in the house'
        };
    }
  };

  const { bgColor, icon, description } = getPhaseDetails();

  return (
    <div className={`absolute inset-0 ${bgColor} pointer-events-none flex items-center justify-center flex-col`}>
      <div className="absolute right-5 top-5 transform scale-150">
        {icon}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-white/30 italic max-w-[200px] text-right">
        {description}
      </div>
    </div>
  );
};

export default EnvironmentIndicator;
