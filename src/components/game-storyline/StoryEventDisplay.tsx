
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoryEvent } from '@/hooks/game-phases/usePlayerStorylineManager';
import { Book, User, Lightbulb, Users, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        return <Book className="w-6 h-6 text-amber-400" />;
      case 'social':
        return <MessageSquare className="w-6 h-6 text-blue-400" />;
      case 'alliance':
        return <Users className="w-6 h-6 text-green-400" />;
      case 'twist':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'competition':
        return <Lightbulb className="w-6 h-6 text-red-400" />;
      default:
        return null;
    }
  };

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'diary': return 'DIARY ROOM';
      case 'social': return 'CONVERSATION';
      case 'alliance': return 'ALLIANCE TALK';
      case 'twist': return 'GAME TWIST';
      case 'competition': return 'COMPETITION';
      default: return 'EVENT';
    }
  };

  const getEventBgColor = () => {
    switch (event.type) {
      case 'diary': return 'bg-amber-950/30';
      case 'social': return 'bg-blue-950/30';
      case 'alliance': return 'bg-green-950/30';
      case 'twist': return 'bg-purple-950/30';
      case 'competition': return 'bg-red-950/30';
      default: return 'bg-slate-950/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("bg-game-dark text-white border-game-accent max-w-lg", getEventBgColor())}>
        {/* Event Type Badge */}
        <div className="absolute top-3 right-10 bg-game-dark/80 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          {getEventIcon()}
          <span>{getEventTypeLabel()}</span>
        </div>
        
        <DialogHeader className="mt-4">
          <DialogTitle className="text-2xl font-bold text-game-accent">{event.title}</DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-gray-200 text-base mt-2 whitespace-pre-line">
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
                  <div className="text-xs text-gray-400 mt-1 italic">
                    Outcome: {option.consequence}
                  </div>
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
