
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface SaveButtonProps {
  isLoading: boolean;
  onSave: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  isLoading, 
  onSave 
}) => {
  return (
    <Button 
      variant="default" 
      onClick={onSave} 
      disabled={isLoading} 
      className="gap-1 whitespace-nowrap"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save
    </Button>
  );
};
