
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, SkipForward, X } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [selectedPhase, setSelectedPhase] = useState('');
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
    onClose();
  };
  
  return (
    <div className="absolute bottom-4 right-4 z-20 bg-black/90 border border-red-500 rounded-lg p-4 w-64">
      <h3 className="text-red-500 font-bold flex items-center">
        <Shield className="w-4 h-4 mr-2" />
        Admin Controls
      </h3>
      
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
            onClick={onClose}
            className="border-gray-700 text-gray-400"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
