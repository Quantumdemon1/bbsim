
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { relationshipTypes, RelationshipType } from '@/hooks/game-phases/types';

interface RelationshipRowProps {
  targetId: string;
  targetName: string;
  targetImage: string;
  relationshipType: RelationshipType | null;
  extraPoints: number | null;
  isMutual: boolean | null;
  isPermanent: boolean | null;
  extraOptions: number[];
  onUpdateRelationship: (targetId: string, field: string, value: any) => void;
}

const RelationshipRow: React.FC<RelationshipRowProps> = ({
  targetId,
  targetName,
  targetImage,
  relationshipType,
  extraPoints,
  isMutual,
  isPermanent,
  extraOptions,
  onUpdateRelationship
}) => {
  return (
    <div className="bg-game-dark p-3 rounded">
      <div className="flex items-center mb-2">
        <img 
          src={targetImage} 
          alt={targetName} 
          className="w-10 h-10 object-cover rounded-full mr-2" 
        />
        <span className="font-medium">{targetName}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Relationship</label>
          <select 
            className="w-full bg-game-light/20 border border-gray-700 rounded p-1 text-sm"
            value={relationshipType || 'Neutral'}
            onChange={(e) => onUpdateRelationship(targetId, 'type', e.target.value as RelationshipType)}
          >
            {relationshipTypes.map(type => (
              <option key={`type-${targetId}-${type}`} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-1">Extra Points</label>
          <select 
            className="w-full bg-game-light/20 border border-gray-700 rounded p-1 text-sm"
            value={extraPoints || 0}
            onChange={(e) => onUpdateRelationship(targetId, 'extraPoints', parseInt(e.target.value))}
          >
            {extraOptions.map(value => (
              <option key={`extra-${targetId}-${value}`} value={value}>
                {value > 0 ? `+${value}` : value}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Checkbox 
            id={`mutual-${targetId}`}
            checked={isMutual || false}
            onCheckedChange={(checked) => 
              onUpdateRelationship(targetId, 'isMutual', checked)
            }
            className="border-gray-500"
          />
          <label htmlFor={`mutual-${targetId}`} className="ml-2 text-sm">
            Mutual?
          </label>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id={`permanent-${targetId}`}
            checked={isPermanent || false}
            onCheckedChange={(checked) => 
              onUpdateRelationship(targetId, 'isPermanent', checked)
            }
            className="border-gray-500"
          />
          <label htmlFor={`permanent-${targetId}`} className="ml-2 text-sm">
            Permanent?
          </label>
        </div>
      </div>
    </div>
  );
};

export default RelationshipRow;
