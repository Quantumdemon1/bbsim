
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { relationshipTypes, RelationshipType } from '@/hooks/game-phases/types';
import { AlertTriangle } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RelationshipRowProps {
  targetId: string;
  targetName: string;
  targetImage?: string | null;
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
  const [imageError, setImageError] = useState<boolean>(false);
  
  // Handle null values safely with defaults
  const safeRelationshipType = relationshipType || 'Neutral';
  const safeExtraPoints = typeof extraPoints === 'number' ? extraPoints : 0;
  const safeIsMutual = Boolean(isMutual);
  const safeIsPermanent = Boolean(isPermanent);

  // Safe field update handler with type checking
  const handleUpdateField = <T extends string | number | boolean>(
    field: string,
    value: T
  ): void => {
    onUpdateRelationship(targetId, field, value);
  };

  return (
    <div className="bg-game-dark p-3 rounded">
      <div className="flex items-center mb-2">
        {!imageError && targetImage ? (
          <img 
            src={targetImage} 
            alt={targetName} 
            className="w-10 h-10 object-cover rounded-full mr-2" 
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-10 h-10 bg-game-medium rounded-full mr-2 flex items-center justify-center text-gray-400">
            {targetName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium">{targetName}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-xs text-gray-400 block mb-1 flex items-center">
            Relationship
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-help">
                    <AlertTriangle size={12} className="inline text-yellow-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">This will affect how players interact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <select 
            className="w-full bg-game-light/20 border border-gray-700 rounded p-1 text-sm"
            value={safeRelationshipType}
            onChange={(e) => handleUpdateField('type', e.target.value as RelationshipType)}
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
            value={safeExtraPoints}
            onChange={(e) => handleUpdateField('extraPoints', parseInt(e.target.value, 10))}
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
            checked={safeIsMutual}
            onCheckedChange={(checked) => 
              handleUpdateField('isMutual', !!checked)
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
            checked={safeIsPermanent}
            onCheckedChange={(checked) => 
              handleUpdateField('isPermanent', !!checked)
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
