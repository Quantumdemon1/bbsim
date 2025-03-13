
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SaveIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DiarySectionProps {
  currentPlayerId: string | null;
  actionsRemaining: number;
}

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
}

const DiarySection: React.FC<DiarySectionProps> = ({ currentPlayerId, actionsRemaining }) => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  // Load diary entries from localStorage
  useEffect(() => {
    if (currentPlayerId) {
      const savedEntries = localStorage.getItem(`diary-${currentPlayerId}`);
      if (savedEntries) {
        setDiaryEntries(JSON.parse(savedEntries));
      }
    }
  }, [currentPlayerId]);

  // Save diary entries to localStorage
  const saveDiaryEntries = (entries: DiaryEntry[]) => {
    if (currentPlayerId) {
      localStorage.setItem(`diary-${currentPlayerId}`, JSON.stringify(entries));
      setDiaryEntries(entries);
    }
  };

  const addDiaryEntry = () => {
    if (!newEntry.trim()) return;
    
    if (actionsRemaining <= 0) {
      toast({
        title: "No Actions Remaining",
        description: "You need at least one action to write in your diary.",
        variant: "destructive"
      });
      return;
    }
    
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      content: newEntry
    };
    
    const updatedEntries = [entry, ...diaryEntries];
    saveDiaryEntries(updatedEntries);
    setNewEntry('');
    
    toast({
      title: "Diary Updated",
      description: "Your thoughts have been recorded.",
    });
  };

  const updateDiaryEntry = (id: string, content: string) => {
    const updatedEntries = diaryEntries.map(entry => 
      entry.id === id ? { ...entry, content } : entry
    );
    saveDiaryEntries(updatedEntries);
    setEditing(null);
    
    toast({
      title: "Entry Updated",
      description: "Your diary entry has been updated.",
    });
  };

  const deleteDiaryEntry = (id: string) => {
    const updatedEntries = diaryEntries.filter(entry => entry.id !== id);
    saveDiaryEntries(updatedEntries);
    
    toast({
      title: "Entry Deleted",
      description: "Your diary entry has been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-game-medium/30 p-3 rounded-lg">
        <Textarea 
          value={newEntry} 
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Record your thoughts, strategies, and observations..."
          className="bg-game-dark/50 border-game-medium mb-2 text-white placeholder:text-gray-400"
        />
        <div className="flex justify-end">
          <Button 
            onClick={addDiaryEntry} 
            disabled={!newEntry.trim() || actionsRemaining <= 0}
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" /> Add Entry
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {diaryEntries.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center p-4">
            Your diary is empty. Record your thoughts to reference later.
          </p>
        ) : (
          diaryEntries.map(entry => (
            <Card key={entry.id} className="bg-game-dark/50 border-game-medium p-3">
              <div className="text-xs text-gray-400 mb-1">{entry.date}</div>
              
              {editing === entry.id ? (
                <>
                  <Textarea 
                    defaultValue={entry.content} 
                    className="bg-game-dark/50 border-game-medium mb-2 text-white"
                    id={`edit-${entry.id}`}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById(`edit-${entry.id}`) as HTMLTextAreaElement;
                        updateDiaryEntry(entry.id, textarea.value);
                      }}
                    >
                      <SaveIcon className="w-4 h-4 mr-1" /> Save
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditing(entry.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteDiaryEntry(entry.id)}
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DiarySection;
