
import React from 'react';
import { GamePhase } from '@/types/gameTypes';

interface GameStatusMessageProps {
  currentPhase: GamePhase;
  dayCount: number;
}

const GameStatusMessage: React.FC<GameStatusMessageProps> = ({ currentPhase, dayCount }) => {
  const getStatusMessage = () => {
    switch (currentPhase) {
      case 'HoH Competition':
        return "The HoH competition will determine who has power this week.";
      case 'Nomination Ceremony':
        return "The Head of Household will soon nominate two players for eviction.";
      case 'PoV Competition':
        return "The Power of Veto competition could change the nominations.";
      case 'Veto Ceremony':
        return "The Power of Veto holder will decide whether to use their power.";
      case 'Eviction Voting':
        return "One of the nominees will be evicted from the house.";
      default:
        return "It's Day " + dayCount + " in the Big Brother house.";
    }
  };

  return (
    <div className="bg-game-medium p-3 rounded-md mb-4">
      <p className="italic text-gray-300">{getStatusMessage()}</p>
    </div>
  );
};

export default GameStatusMessage;
