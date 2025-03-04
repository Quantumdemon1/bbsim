
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedGameCard } from './SavedGameCard';
import { SavedGameState } from '@/hooks/gameState/types/gameStatePersistenceTypes';

interface SaveGameListProps {
  savedGames: SavedGameState[];
  loadingGameId: string | null;
  deletingGameId: string | null;
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string, e: React.MouseEvent) => void;
}

export const SaveGameList: React.FC<SaveGameListProps> = ({
  savedGames,
  loadingGameId,
  deletingGameId,
  onLoadGame,
  onDeleteGame
}) => {
  if (savedGames.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No saved games yet. Start a game and save your progress!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="p-4 space-y-4">
        {savedGames.map(game => (
          <SavedGameCard
            key={game.id}
            game={game}
            onLoadGame={onLoadGame}
            onDeleteGame={onDeleteGame}
            isLoading={loadingGameId === game.game_id}
            isDeletingGame={deletingGameId === game.game_id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
