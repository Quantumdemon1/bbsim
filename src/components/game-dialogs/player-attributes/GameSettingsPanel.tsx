
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const GameSettingsPanel: React.FC = () => {
  return (
    <div className="bg-game-medium p-4 rounded-lg">
      <h3 className="font-medium mb-4">Game Settings</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Game Difficulty</Label>
            <Slider 
              id="difficulty"
              defaultValue={[5]} 
              max={10} 
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Easy</span>
              <span>Normal</span>
              <span>Hard</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aiAggressiveness">AI Aggressiveness</Label>
            <Slider 
              id="aiAggressiveness"
              defaultValue={[5]} 
              max={10} 
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Passive</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableTwists">Enable Game Twists</Label>
              <div className="text-xs text-gray-400">Allow unexpected events during gameplay</div>
            </div>
            <Switch id="enableTwists" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enablePowerups">Enable Power-Ups</Label>
              <div className="text-xs text-gray-400">Allow players to earn and use special abilities</div>
            </div>
            <Switch id="enablePowerups" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="realisticVoting">Realistic Voting</Label>
              <div className="text-xs text-gray-400">AI players vote based on relationships and strategy</div>
            </div>
            <Switch id="realisticVoting" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsPanel;
