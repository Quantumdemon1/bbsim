
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { SaveGameList } from './SaveGameList';
import { SavedGameState } from '@/hooks/gameState/types/gameStatePersistenceTypes';
import { formatDistanceToNow } from 'date-fns';

interface SaveGameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  savedGames: SavedGameState[];
  savingError: string | null;
  loadingError: string | null;
  lastSaved: Date | null;
  loadingGameId: string | null;
  deletingGameId: string | null;
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string, e: React.MouseEvent) => void;
  onClose?: () => void;
}

export const SaveGameDialog: React.FC<SaveGameDialogProps> = ({
  isOpen,
  setIsOpen,
  savedGames,
  savingError,
  loadingError,
  lastSaved,
  loadingGameId,
  deletingGameId,
  onLoadGame,
  onDeleteGame,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1 whitespace-nowrap text-blue-950">
          <Save className="h-4 w-4" />
          Saved Games
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Games</DialogTitle>
          <DialogDescription>
            Load a previously saved game or start a new one.
            {lastSaved && (
              <div className="mt-1 text-xs text-green-500">
                Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {savingError && (
          <div className="p-3 mb-4 bg-red-900/20 border border-red-800 rounded-md text-sm text-red-400">
            {savingError}
          </div>
        )}
        
        {loadingError && (
          <div className="p-3 mb-4 bg-red-900/20 border border-red-800 rounded-md text-sm text-red-400">
            {loadingError}
          </div>
        )}

        <SaveGameList
          savedGames={savedGames}
          loadingGameId={loadingGameId}
          deletingGameId={deletingGameId}
          onLoadGame={onLoadGame}
          onDeleteGame={onDeleteGame}
        />

        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
