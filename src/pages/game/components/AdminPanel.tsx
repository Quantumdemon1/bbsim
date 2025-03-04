
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, SkipForward, X } from 'lucide-react';
import { useGameContext } from '@/hooks/useGameContext';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [selectedPhase, setSelectedPhase] = useState('');
  const [open, setOpen] = useState(true);
  const { adminTakeControl } = useGameContext();
  
  const phases = [
    'HoH Competition',
    'Nomination Ceremony',
    'PoV Competition',
    'Veto Ceremony',
    'Eviction Voting',
    'Eviction',
    'Weekly Summary'
  ];
  
  const handleTakeControl = () => {
    adminTakeControl(selectedPhase || undefined);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) onClose();
    }}>
      <DialogContent className="bg-black/90 border border-red-500 rounded-lg p-4 w-64">
        <DialogHeader>
          <DialogTitle className="text-red-500 font-bold flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Admin Controls
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-3">
          <label className="text-xs text-white">Jump to phase:</label>
          <select 
            className="w-full bg-gray-800 text-white rounded p-1 text-sm mt-1 border border-gray-700"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="">Select phase...</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
          
          <div className="flex space-x-2 mt-3">
            <Button 
              size="sm" 
              variant="destructive"
              className="flex-1"
              onClick={handleTakeControl}
            >
              <SkipForward className="w-3 h-3 mr-1" />
              Take Control
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleClose}
              className="border-gray-700 text-gray-400"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
