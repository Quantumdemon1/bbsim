
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from './PlayerProfile';

interface GamePhaseDisplayProps {
  phase: string;
  week: number;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  onAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
}

const GamePhaseDisplay: React.FC<GamePhaseDisplayProps> = ({
  phase,
  week,
  players,
  nominees,
  hoh,
  veto,
  onAction,
  statusMessage,
  selectedPlayers,
  onPlayerSelect
}) => {
  const renderPhaseContent = () => {
    switch (phase) {
      case 'HoH Competition':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Head of Household Competition</h2>
            <p className="text-center mb-8 text-gray-300">Select a player to be the new Head of Household:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {players
                .filter(p => p.status !== 'evicted')
                .map(player => (
                  <PlayerProfile
                    key={player.id}
                    player={player}
                    onClick={() => onPlayerSelect(player.id)}
                    selected={selectedPlayers.includes(player.id)}
                  />
                ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('selectHOH')}
                disabled={selectedPlayers.length !== 1}
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        );
        
      case 'Nomination Ceremony':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Nomination Ceremony</h2>
            
            {hoh && (
              <div className="mb-8">
                <p className="text-center text-gray-300 mb-4">Current Head of Household:</p>
                <div className="flex justify-center">
                  {players.filter(p => p.id === hoh).map(player => (
                    <PlayerProfile key={player.id} player={player} size="lg" />
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-center mb-8 text-gray-300">Select two houseguests to nominate for eviction:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {players
                .filter(p => p.id !== hoh && p.status !== 'evicted')
                .map(player => (
                  <PlayerProfile
                    key={player.id}
                    player={player}
                    onClick={() => onPlayerSelect(player.id)}
                    selected={selectedPlayers.includes(player.id)}
                  />
                ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('nominate')}
                disabled={selectedPlayers.length !== 2}
              >
                Confirm Nominations
              </Button>
            </div>
          </div>
        );
        
      case 'PoV Competition':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Power of Veto Competition</h2>
            <p className="text-center mb-8 text-gray-300">Select a player to win the Power of Veto:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {players
                .filter(p => p.status !== 'evicted')
                .map(player => (
                  <PlayerProfile
                    key={player.id}
                    player={player}
                    onClick={() => onPlayerSelect(player.id)}
                    selected={selectedPlayers.includes(player.id)}
                  />
                ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('selectVeto')}
                disabled={selectedPlayers.length !== 1}
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        );
        
      case 'Veto Ceremony':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Veto Ceremony</h2>
            
            {veto && (
              <div className="mb-8">
                <p className="text-center text-gray-300 mb-4">Current Veto Holder:</p>
                <div className="flex justify-center">
                  {players.filter(p => p.id === veto).map(player => (
                    <PlayerProfile key={player.id} player={player} size="lg" />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-center mb-8">
              <p className="text-center text-gray-300 mb-4">Current Nominees:</p>
              <div className="flex gap-8">
                {players
                  .filter(p => nominees.includes(p.id))
                  .map(player => (
                    <PlayerProfile key={player.id} player={player} />
                  ))}
              </div>
            </div>
            
            <p className="text-center mb-8 text-gray-300">
              Choose an action for the Power of Veto:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('vetoAction', 'use')}
              >
                Use Veto
              </Button>
              
              <Button 
                className="bg-game-medium hover:bg-game-light border border-white/20 text-white px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('vetoAction', 'dontUse')}
              >
                Don't Use Veto
              </Button>
            </div>
          </div>
        );
        
      case 'Eviction Voting':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Eviction Voting</h2>
            
            <div className="flex flex-col items-center mb-8">
              <p className="text-center text-gray-300 mb-4">Final Nominees:</p>
              <div className="flex gap-8">
                {players
                  .filter(p => nominees.includes(p.id))
                  .map(player => (
                    <PlayerProfile key={player.id} player={player} size="lg" />
                  ))}
              </div>
            </div>
            
            <p className="text-center mb-8 text-gray-300">
              Select a nominee to evict from the Big Brother house:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              {players
                .filter(p => nominees.includes(p.id))
                .map(player => (
                  <div key={player.id} className="flex flex-col items-center">
                    <PlayerProfile player={player} />
                    <Button 
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md button-glow"
                      onClick={() => onAction('evict', player.id)}
                    >
                      Evict {player.name}
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        );
        
      case 'Eviction':
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">Eviction Results</h2>
            
            <p className="text-center mb-8 text-xl">
              {statusMessage}
            </p>
            
            <div className="flex justify-center mb-8">
              {players
                .filter(p => p.status === 'evicted' && p.id === selectedPlayers[0])
                .map(player => (
                  <PlayerProfile key={player.id} player={player} size="lg" />
                ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
                onClick={() => onAction('nextWeek')}
              >
                Continue to Week {week + 1}
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-6">{phase}</h2>
            <p className="text-center text-gray-300">
              {statusMessage || `This phase is not yet implemented.`}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderPhaseContent()}
    </div>
  );
};

export default GamePhaseDisplay;
