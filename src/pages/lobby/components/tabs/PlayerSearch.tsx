
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface PlayerSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const PlayerSearch = ({ searchTerm, setSearchTerm }: PlayerSearchProps) => {
  return (
    <div className="relative mb-4 w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder="Search players..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-game-medium border-game-accent/50 text-white placeholder:text-gray-400 focus-visible:ring-game-accent"
      />
    </div>
  );
};

export default PlayerSearch;
