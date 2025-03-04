import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useGameContext } from '@/hooks/useGameContext';
import AIThinkingIndicator from './AIThinkingIndicator';

interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  consequence?: string;
}

interface PlayerDecisionPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  situation: string;
  options: DecisionOption[];
  onDecisionMade: (optionId: string) => void;
  targetPlayerId?: string;
  showThinking?: boolean;
}

export const PlayerDecisionPrompt: React.FC<PlayerDecisionPromptProps> = ({
  open,
  onOpenChange,
  title,
  description,
  situation,
  options,
  onDecisionMade,
  targetPlayerId,
  showThinking = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { isThinking, players } = useGameContext();
  
  const targetPlayer = targetPlayerId ? players.find(p => p.id === targetPlayerId) : null;
  const isTargetThinking = targetPlayerId ? isThinking[targetPlayerId] : false;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      onDecisionMade(selectedOption);
      setSelectedOption(null);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-game-dark text-white border-game-accent max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-game-accent">{title}</DialogTitle>
            <DialogDescription className="text-gray-300">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          {showThinking && targetPlayerId && isTargetThinking && (
            <div className="mb-4">
              <AIThinkingIndicator playerId={targetPlayerId} />
            </div>
          )}
          
          <div className="space-y-4 my-4">
            {options.map((option) => (
              <div key={option.id} className="space-y-2">
                <Button 
                  className="w-full text-left justify-start bg-game-medium hover:bg-game-highlight hover:text-black transition-all p-4"
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div>
                    <div className="font-bold">{option.label}</div>
                    {option.description && (
                      <div className="text-sm opacity-80 mt-1">{option.description}</div>
                    )}
                  </div>
                </Button>
              </div>
            ))}
          </div>
          
          {targetPlayer && (
            <div className="mt-2 border-t border-gray-700 pt-3">
              <p className="text-sm text-gray-300 italic">
                {isTargetThinking 
                  ? `${targetPlayer.name} is considering...` 
                  : `${targetPlayer.name} is waiting for your decision.`}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {selectedOption && (
        <ConfirmationDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm Your Decision"
          description={`Are you sure you want to choose "${options.find(o => o.id === selectedOption)?.label}"? This decision may impact your relationships and game standing.`}
          confirmLabel="Confirm Decision"
          cancelLabel="Reconsider"
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};
