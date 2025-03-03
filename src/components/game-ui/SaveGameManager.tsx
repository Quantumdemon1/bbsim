import React, { useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  const handleSaveGame = async () => {
    if (saveGame) {
      await saveGame();
      if (onClose) onClose();
    }
  };
  const handleLoadGame = async (gameId: string) => {
    if (!loadGame) return;
    setLoadingGameId(gameId);
    const success = await loadGame(gameId);
    setLoadingGameId(null);
    if (success) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };
  const handleDeleteGame = async (gameId: string, e: React.MouseEvent) => {
    if (!deleteSavedGame) return;
    e.stopPropagation();
    setDeletingGameId(gameId);
    await deleteSavedGame(gameId);
    setDeletingGameId(null);
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-1 whitespace-nowrap text-blue-950">
            <Save className="h-4 w-4" />
            Saved Games
          </Button>
        </DialogTrigger>
        
        {gameId && gameState === 'playing' && <Button variant="default" onClick={handleSaveGame} disabled={isLoadingSave} className="gap-1 whitespace-nowrap">
            {isLoadingSave ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>}
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Games</DialogTitle>
          <DialogDescription>
            Load a previously saved game or start a new one.
          </DialogDescription>
        </DialogHeader>

        {savedGames.length === 0 ? <div className="py-6 text-center text-sm text-muted-foreground">
            No saved games yet. Start a game and save your progress!
          </div> : <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-4">
              {savedGames.map(game => <Card key={game.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleLoadGame(game.game_id)}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex justify-between">
                      <span>Game #{game.game_id}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => handleDeleteGame(game.game_id, e)} disabled={deletingGameId === game.game_id}>
                        {deletingGameId === game.game_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Saved {game.updated_at ? formatDistanceToNow(new Date(game.updated_at), {
                  addSuffix: true
                }) : 'recently'}
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
                    <Button className="w-full" variant="outline" disabled={loadingGameId === game.game_id} onClick={() => handleLoadGame(game.game_id)}>
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
    </Dialog>;
};