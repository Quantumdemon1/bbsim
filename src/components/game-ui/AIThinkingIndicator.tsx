
import React from 'react';
import { Loader2, Bot, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGameContext } from '@/contexts/GameContext';

interface AIThinkingIndicatorProps {
  playerId: string;
}

const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ playerId }) => {
  const { isThinking, players } = useGameContext();
  
  const player = players.find(p => p.id === playerId);
  const thinking = isThinking[playerId];
  
  if (!thinking || !player) return null;
  
  return (
    <Card className="absolute top-0 right-0 z-10 shadow-lg animate-in fade-in slide-in-from-top-5 duration-300">
      <CardContent className="p-3 flex items-center gap-2">
        <Bot className="h-4 w-4 text-blue-500" />
        <div className="flex flex-col">
          <div className="text-sm font-medium">{player.name} is thinking</div>
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-gray-400" />
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIThinkingIndicator;
