
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoryEvent } from '@/hooks/game-phases/storyline/types';
import { Book, User, Lightbulb, Users, Sparkles, MessageSquare, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

  // Function to visualize relationship effect
  const getRelationshipEffectIndicator = (effect: number | undefined) => {
    if (!effect || effect === 0) return null;
    
    const color = effect > 0 
      ? 'text-green-400' 
      : effect < 0 
        ? 'text-red-400' 
        : 'text-gray-400';
        
    const label = effect > 0 
      ? '+' + effect 
      : effect.toString();
      
    return (
      <span className={`ml-2 text-xs font-bold ${color}`}>
        {label} REL
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("bg-game-dark text-white border-game-accent max-w-lg", getEventBgColor())}>
        {/* Event Type Badge */}
        <div className="absolute top-3 right-10 bg-game-dark/80 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          {getEventIcon()}
          <span>{getEventTypeLabel()}</span>
          
          {/* Storyline indicator */}
          {event.storylineId && (
            <Badge variant="outline" className="ml-2 bg-yellow-900/30 text-yellow-300 border-yellow-500">
              {event.sequence ? `Part ${event.sequence}` : 'Story'}
            </Badge>
          )}
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
                <div className="w-full">
                  <div className="font-bold flex items-center justify-between">
                    <span>{option.text}</span>
                    {getRelationshipEffectIndicator(option.relationshipEffect)}
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-1 italic flex items-center">
                    <span className="mr-1">Outcome:</span> 
                    {option.consequence}
                    
                    {/* Display importance indicator for choices with high importance */}
                    {option.memoryImportance && option.memoryImportance > 7 && (
                      <span className="ml-2 flex items-center text-amber-400">
                        <AlertTriangle className="w-3 h-3 mr-1" /> 
                        Significant
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>
        
        {/* Connection to the player */}
        {event.requires?.playerId && (
          <div className="mt-2 border-t border-gray-700 pt-3">
            <p className="text-sm text-gray-300 italic flex items-center">
              <User className="w-4 h-4 mr-2" />
              This involves your relationship with another houseguest.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryEventDisplay;
