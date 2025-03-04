
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface AutoSaveToggleProps {
  isAutoSaveEnabled: boolean;
  onToggle: () => void;
}

export const AutoSaveToggle: React.FC<AutoSaveToggleProps> = ({ 
  isAutoSaveEnabled, 
  onToggle 
}) => {
  return (
    <Button
      variant="outline"
      onClick={onToggle}
      className={`gap-1 whitespace-nowrap ${isAutoSaveEnabled ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}
      title={`Auto-save is ${isAutoSaveEnabled ? 'enabled' : 'disabled'}`}
    >
      <Clock className="h-4 w-4" />
      {isAutoSaveEnabled ? 'Auto: ON' : 'Auto: OFF'}
    </Button>
  );
};
