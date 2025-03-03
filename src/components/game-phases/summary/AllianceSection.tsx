
import React from 'react';
import { Alliance } from '@/contexts/types';
import { Users } from 'lucide-react';

interface AllianceSectionProps {
  alliances?: Alliance[];
}

const AllianceSection: React.FC<AllianceSectionProps> = ({ alliances = [] }) => {
  if (!alliances || alliances.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-game-dark/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Users className="text-teal-500 mr-2" size={20} />
        Current Alliances
      </h3>
      <div className="flex flex-wrap gap-2">
        {alliances.map(alliance => (
          <div key={alliance.id} className="bg-game-dark/50 rounded-full px-3 py-1 text-sm">
            {alliance.name} 
            <span className="ml-1 text-xs text-gray-400">
              ({alliance.members.length})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllianceSection;
