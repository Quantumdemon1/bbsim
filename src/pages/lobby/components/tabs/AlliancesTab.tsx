
import React from 'react';
import { Card } from "@/components/ui/card";

const AlliancesTab = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="bg-game-dark border-game-accent/50 p-4">
        <h3 className="text-lg font-semibold text-game-accent mb-2">What are Alliances?</h3>
        <p className="text-gray-300 text-sm">
          Alliances are secret or public agreements between houseguests to work together, 
          protect each other, and vote together. A strong alliance can control the game and 
          carry its members to the end.
        </p>
        
        <h4 className="font-medium mt-4 mb-1">Alliance Strategies:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Build a small, loyal core alliance</li>
          <li>• Create side alliances for extra protection</li>
          <li>• Maintain good relationships outside your alliance</li>
          <li>• Win competitions to keep your alliance safe</li>
          <li>• Be careful who you trust with information</li>
        </ul>
      </Card>
      
      <Card className="bg-game-dark border-game-accent/50 p-4">
        <h3 className="text-lg font-semibold text-game-accent mb-2">Famous BB Alliances</h3>
        <div className="space-y-2">
          <div className="bg-game-medium/30 p-2 rounded">
            <div className="font-medium">The Brigade</div>
            <div className="text-xs text-gray-400">Season 12</div>
          </div>
          <div className="bg-game-medium/30 p-2 rounded">
            <div className="font-medium">The Hitmen</div>
            <div className="text-xs text-gray-400">Season 16</div>
          </div>
          <div className="bg-game-medium/30 p-2 rounded">
            <div className="font-medium">The Cookout</div>
            <div className="text-xs text-gray-400">Season 23</div>
          </div>
          <div className="bg-game-medium/30 p-2 rounded">
            <div className="font-medium">Sovereign Six</div>
            <div className="text-xs text-gray-400">Season 6</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AlliancesTab;
