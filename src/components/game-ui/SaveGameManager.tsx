
import React from 'react';
import { useSaveGameManager } from './save-game/useSaveGameManager';
import { SaveGameDialog } from './save-game/SaveGameDialog';
import { SaveButton } from './save-game/SaveButton';
import { AutoSaveToggle } from './save-game/AutoSaveToggle';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export const SaveGameManager = ({
  onClose
}: {
  onClose?: () => void;
}) => {
  const {
    isOpen,
    setIsOpen,
    loadingGameId,
    deletingGameId,
    savingError,
    loadingError,
    isAutoSaveEnabled,
    lastSaved,
    loadConfirmOpen,
    setLoadConfirmOpen,
    gameToLoad,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    gameToDelete,
    isLoadingSave,
    savedGames,
    gameId,
    gameState,
    handleSaveGame,
    handleConfirmLoadGame,
    handleExecuteLoadGame,
    handleDeleteGame,
    handleConfirmDeleteGame,
    handleToggleAutoSave
  } = useSaveGameManager(onClose);

  return (
    <>
      <div className="flex gap-2">
        <SaveGameDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          savedGames={savedGames}
          savingError={savingError}
          loadingError={loadingError}
          lastSaved={lastSaved}
          loadingGameId={loadingGameId}
          deletingGameId={deletingGameId}
          onLoadGame={handleConfirmLoadGame}
          onDeleteGame={handleDeleteGame}
          onClose={onClose}
        />
        
        {gameId && gameState === 'playing' && (
          <div className="flex gap-2">
            <SaveButton 
              isLoading={isLoadingSave} 
              onSave={() => handleSaveGame()} 
            />
            
            <AutoSaveToggle 
              isAutoSaveEnabled={isAutoSaveEnabled} 
              onToggle={handleToggleAutoSave} 
            />
          </div>
        )}
      </div>
      
      {/* Confirmation Dialog for Load Game */}
      <ConfirmationDialog
        open={loadConfirmOpen}
        onOpenChange={setLoadConfirmOpen}
        title="Load Game"
        description="Loading a game will discard your current game progress. Are you sure you want to continue?"
        confirmLabel="Load Game"
        onConfirm={handleExecuteLoadGame}
      />
      
      {/* Confirmation Dialog for Delete Game */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Saved Game"
        description="This action cannot be undone. Are you sure you want to delete this saved game?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDeleteGame}
      />
    </>
  );
};
