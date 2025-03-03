
import React from 'react';
import { PlayerData } from '../../PlayerProfileTypes';
import JuryQuestions from '../JuryQuestions';
import JuryVoting from '../JuryVoting';
import WinnerReveal from '../WinnerReveal';

interface FinalePhaseRendererProps {
  phase: string;
  players: PlayerData[];
  finalists?: string[];
  jurors?: string[];
  votes?: Record<string, string>;
  statusMessage: string;
  onAction: (action: string, data?: any) => void;
}

const FinalePhaseRenderer: React.FC<FinalePhaseRendererProps> = ({
  phase,
  players,
  finalists,
  jurors,
  votes,
  statusMessage,
  onAction
}) => {
  switch (phase) {
    case 'Jury Questions':
      return (
        <JuryQuestions
          players={players}
          finalists={finalists || []}
          jurors={jurors || []}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'Jury Voting':
      return (
        <JuryVoting
          players={players}
          finalists={finalists || []}
          jurors={jurors || []}
          votes={votes || {}}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'The Winner':
      return (
        <WinnerReveal
          players={players}
          votes={votes || {}}
          finalists={finalists || []}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

export default FinalePhaseRenderer;
