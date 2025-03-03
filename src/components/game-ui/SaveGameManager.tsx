
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from "@/hooks/use-toast";

export const SaveGameManager = ({
  onClose
}: {
  onClose?: () => void;
}) => {
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [loadConfirmOpen, setLoadConfirmOpen] = useState<boolean>(false);
  const [gameToLoad, setGameToLoad] = useState<string | null>(null);
  
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

  return (
    <>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-1 whitespace-nowrap text-blue-950">
            <Save className="h-4 w-4" />
            Saved Games
          </Button>
        </DialogTrigger>
        
        {gameId && gameState === 'playing' && (
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={() => handleSaveGame()} 
              disabled={isLoadingSave} 
              className="gap-1 whitespace-nowrap"
            >
              {isLoadingSave ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
            
            <Button
              variant="outline"
              onClick={handleToggleAutoSave}
              className={`gap-1 whitespace-nowrap ${isAutoSaveEnabled ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}
              title={`Auto-save is ${isAutoSaveEnabled ? 'enabled' : 'disabled'}`}
            >
              <Clock className="h-4 w-4" />
              {isAutoSaveEnabled ? 'Auto: ON' : 'Auto: OFF'}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Saved Games</DialogTitle>
            <DialogDescription>
              Load a previously saved game or start a new one.
              {lastSaved && <div className="mt-1 text-xs text-green-500">
                Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </div>}
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

          {savedGames.length === 0 ? <div className="py-6 text-center text-sm text-muted-foreground">
            No saved games yet. Start a game and save your progress!
          </div> : <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-4">
              {savedGames.map(game => <Card 
                key={game.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors" 
                onClick={() => handleConfirmLoadGame(game.game_id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between">
                    <span>Game #{game.game_id}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={e => handleDeleteGame(game.game_id, e)}
                      disabled={deletingGameId === game.game_id}
                    >
                      {deletingGameId === game.game_id 
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
                    disabled={loadingGameId === game.game_id}
                    onClick={() => handleConfirmLoadGame(game.game_id)}
                  >
                    {loadingGameId === game.game_id ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </> : "Load Game"}
                  </Button>
                </CardFooter>
              </Card>)}
            </div>
          </ScrollArea>}

          <DialogFooter className="sm:justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
