
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoryEvent } from '@/hooks/game-phases/usePlayerStorylineManager';
import { Book, User, Lightbulb, Users, Sparkles } from 'lucide-react';

interface StoryEventDisplayProps {
  event: StoryEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoiceMade: (eventId: string, choiceId: string) => void;
}

const StoryEventDisplay: React.FC<StoryEventDisplayProps> = ({
  event,
  open,
  onOpenChange,
  onChoiceMade
}) => {
  if (!event) return null;

  const handleChoice = (choiceId: string) => {
    onChoiceMade(event.id, choiceId);
  };

  const getEventIcon = () => {
    switch (event.type) {
      case 'diary':
        return <Book className="w-5 h-5 text-amber-400" />;
      case 'social':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'alliance':
        return <Users className="w-5 h-5 text-green-400" />;
      case 'twist':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'competition':
        return <Lightbulb className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-lg">
        <DialogHeader className="flex flex-row items-center gap-2">
          {getEventIcon()}
          <DialogTitle className="text-xl font-bold text-game-accent">{event.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-300 text-base">
          {event.description}
        </DialogDescription>
        
        <div className="space-y-3 my-4">
          {event.options?.map((option) => (
            <div key={option.id} className="space-y-1">
              <Button 
                className="w-full text-left justify-start bg-game-medium hover:bg-game-highlight hover:text-black transition-all p-4"
                onClick={() => handleChoice(option.id)}
              >
                <div>
                  <div className="font-bold">{option.text}</div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryEventDisplay;
