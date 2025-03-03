
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface AttributeEditorProps {
  player: PlayerData;
  onUpdateAttribute: (playerId: string, attribute: string, value: number | boolean | PlayerData['status']) => void;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({ player, onUpdateAttribute }) => {
  const attributes = [
    { id: 'physical', name: 'Physical', description: 'Strength, agility, and athletic ability' },
    { id: 'mental', name: 'Mental', description: 'Intelligence, puzzle-solving, and memory' },
    { id: 'social', name: 'Social', description: 'Charisma, persuasion, and likability' },
    { id: 'endurance', name: 'Endurance', description: 'Stamina and ability to withstand challenges' },
    { id: 'strategic', name: 'Strategic', description: 'Game awareness and planning ability' },
    { id: 'loyalty', name: 'Loyalty', description: 'Tendency to remain loyal to allies' },
    { id: 'temperament', name: 'Temperament', description: 'Emotional stability under pressure' },
  ];

  const statusOptions = ['hoh', 'nominated', 'veto', 'safe', 'evicted'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img 
          src={player.image} 
          alt={player.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-red-500" 
        />
        <div>
          <h3 className="text-lg font-medium">{player.name}</h3>
          <div className="flex space-x-2 mt-1">
            <select
              value={player.status || 'safe'}
              onChange={(e) => onUpdateAttribute(player.id, 'status', e.target.value as PlayerData['status'])}
              className="bg-game-dark border border-gray-700 rounded text-sm p-1"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1">
              <Label htmlFor={`isHuman-${player.id}`} className="text-sm">Human Player</Label>
              <Switch 
                id={`isHuman-${player.id}`}
                checked={player.isHuman || false}
                onCheckedChange={(checked) => onUpdateAttribute(player.id, 'isHuman', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {attributes.map(attr => {
          const attrValue = (player[attr.id as keyof PlayerData] as number) || 5;
          return (
            <div key={attr.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`${attr.id}-${player.id}`} className="text-sm">
                  {attr.name}
                </Label>
                <span className="text-sm font-medium">{attrValue}</span>
              </div>
              <Slider 
                id={`${attr.id}-${player.id}`}
                min={1}
                max={10}
                step={1}
                value={[attrValue]}
                onValueChange={([value]) => onUpdateAttribute(player.id, attr.id, value)}
              />
              <p className="text-xs text-gray-400">{attr.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor={`isAdmin-${player.id}`}>Admin Privileges</Label>
            <div className="text-xs text-gray-400">Can control game and make admin decisions</div>
          </div>
          <Switch 
            id={`isAdmin-${player.id}`}
            checked={player.isAdmin || false}
            onCheckedChange={(checked) => onUpdateAttribute(player.id, 'isAdmin', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AttributeEditor;
