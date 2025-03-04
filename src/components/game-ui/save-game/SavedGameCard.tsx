
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { SavedGameState } from '@/hooks/gameState/types/gameStatePersistenceTypes';

interface SavedGameCardProps {
  game: SavedGameState;
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string, e: React.MouseEvent) => void;
  isLoading: boolean;
  isDeletingGame: boolean;
}

export const SavedGameCard: React.FC<SavedGameCardProps> = ({
  game,
  onLoadGame,
  onDeleteGame,
  isLoading,
  isDeletingGame
}) => {
  return (
    <Card 
      key={game.id} 
      className="cursor-pointer hover:bg-accent/50 transition-colors" 
      onClick={() => onLoadGame(game.game_id)}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base flex justify-between">
          <span>Game #{game.game_id}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={e => onDeleteGame(game.game_id, e)}
            disabled={isDeletingGame}
          >
            {isDeletingGame 
              ? <Loader2 className="h-4 w-4 animate-spin" /> 
              : <Trash2 className="h-4 w-4 text-destructive" />}
          </Button>
        </CardTitle>
        <CardDescription>
          Saved {game.updated_at 
            ? formatDistanceToNow(new Date(game.updated_at), { addSuffix: true }) 
            : 'recently'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Week:</span>
            <span className="font-medium">{game.week}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Phase:</span>
            <span className="font-medium">{game.phase}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-muted-foreground">Players:</span>
            <span className="font-medium">{game.players?.length || 0} players</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant="outline" 
          disabled={isLoading}
          onClick={() => onLoadGame(game.game_id)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : "Load Game"}
        </Button>
      </CardFooter>
    </Card>
  );
};
