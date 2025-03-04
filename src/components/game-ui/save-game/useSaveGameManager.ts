
import { useState, useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { toast } from "@/hooks/use-toast";

export function useSaveGameManager(onClose?: () => void) {
  const {
    saveGame,
    loadGame,
    savedGames = [],
    deleteSavedGame,
    isLoadingSave,
    gameId,
    gameState
  } = useGameContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loadConfirmOpen, setLoadConfirmOpen] = useState<boolean>(false);
  const [gameToLoad, setGameToLoad] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  
  // Auto-save functionality
  useEffect(() => {
    if (!isAutoSaveEnabled || !saveGame || gameState !== 'playing' || !gameId) return;
    
    const autoSaveInterval = setInterval(async () => {
      try {
        await handleSaveGame(true);
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Don't show toast for auto-save failures to avoid spam
      }
    }, 5 * 60 * 1000); // Auto-save every 5 minutes
    
    return () => clearInterval(autoSaveInterval);
  }, [isAutoSaveEnabled, saveGame, gameState, gameId]);
  
  const handleSaveGame = async (isAutoSave = false) => {
    if (!saveGame) return;
    
    setSavingError(null);
    try {
      await saveGame();
      setLastSaved(new Date());
      if (!isAutoSave) {
        toast({
          title: "Game Saved",
          description: "Your game has been saved successfully.",
        });
      }
      if (onClose && !isAutoSave) onClose();
    } catch (error) {
      console.error('Save game error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setSavingError(message);
      toast({
        title: "Save Failed",
        description: `Failed to save game: ${message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleLoadGame = async (gameId: string) => {
    if (!loadGame) return;
    
    setLoadingGameId(gameId);
    setLoadingError(null);
    try {
      const success = await loadGame(gameId);
      if (success) {
        setIsOpen(false);
        toast({
          title: "Game Loaded",
          description: "Your game has been loaded successfully.",
        });
        if (onClose) onClose();
      } else {
        setLoadingError("Failed to load game. The save may be corrupted or incompatible.");
        toast({
          title: "Load Failed",
          description: "Failed to load game. The save may be corrupted or incompatible.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Load game error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setLoadingError(message);
      toast({
        title: "Load Failed",
        description: `Failed to load game: ${message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingGameId(null);
    }
  };
  
  const handleConfirmLoadGame = (gameId: string) => {
    setGameToLoad(gameId);
    setLoadConfirmOpen(true);
  };
  
  const handleExecuteLoadGame = () => {
    if (gameToLoad) {
      handleLoadGame(gameToLoad);
    }
  };
  
  const handleDeleteGame = async (gameId: string, e: React.MouseEvent) => {
    if (!deleteSavedGame) return;
    e.stopPropagation();
    
    setGameToDelete(gameId);
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDeleteGame = async () => {
    if (!deleteSavedGame || !gameToDelete) return;
    
    setDeletingGameId(gameToDelete);
    try {
      await deleteSavedGame(gameToDelete);
      toast({
        title: "Game Deleted",
        description: "The saved game has been deleted.",
      });
    } catch (error) {
      console.error('Delete game error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Delete Failed",
        description: `Failed to delete game: ${message}`,
        variant: "destructive",
      });
    } finally {
      setDeletingGameId(null);
      setGameToDelete(null);
    }
  };
  
  // Toggle auto-save
  const handleToggleAutoSave = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled);
    toast({
      title: isAutoSaveEnabled ? "Auto-Save Disabled" : "Auto-Save Enabled",
      description: isAutoSaveEnabled 
        ? "Auto-save has been turned off. Remember to save manually." 
        : "Your game will be automatically saved every 5 minutes.",
    });
  };

  return {
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
  };
}
