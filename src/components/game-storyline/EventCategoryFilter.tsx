
import React from 'react';
import { 
  useStorylineEventSystem,
  EventCategory
} from '@/hooks/game-phases/storyline/player-storyline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';

/**
 * Component for filtering events by category
 */
export function EventCategoryFilter() {
  const { 
    categoryOptions, 
    toggleCategory,
    resetFilters
  } = useStorylineEventSystem();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Event Type</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="h-7 text-xs"
        >
          Reset
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map(category => (
          <Badge
            key={category.id}
            variant={category.selected ? "default" : "outline"}
            className={`cursor-pointer ${category.selected ? `bg-${category.color}-600` : ''}`}
            onClick={() => toggleCategory(category.id as EventCategory)}
          >
            <span className="mr-1">
              {category.selected ? (
                <CheckIcon className="h-3 w-3 inline" />
              ) : (
                <XIcon className="h-3 w-3 inline" />
              )}
            </span>
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default EventCategoryFilter;
