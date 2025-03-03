
import React from 'react';
import { useAIPlayerContext } from '@/contexts/AIPlayerContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Brain } from 'lucide-react';

interface AISettingsToggleProps {
  className?: string;
}

const AISettingsToggle = ({ className = '' }: AISettingsToggleProps) => {
  const { isUsingLLM, toggleLLMDecisionMaking } = useAIPlayerContext();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Switch 
          id="llm-toggle" 
          checked={isUsingLLM}
          onCheckedChange={toggleLLMDecisionMaking} 
        />
        <Label htmlFor="llm-toggle" className="cursor-pointer flex items-center gap-1.5">
          {isUsingLLM ? (
            <>
              <Brain className="h-4 w-4 text-blue-500" />
              <span>Advanced AI</span>
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 text-gray-500" />
              <span>Basic AI</span>
            </>
          )}
        </Label>
      </div>
    </div>
  );
};

export default AISettingsToggle;
