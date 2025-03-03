
import React from 'react';
import { PlayerData } from '../PlayerProfile';
import { Alliance } from '@/contexts/types';
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '@/contexts/GameContext';

interface GamePhaseManagerProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}

const GamePhaseManager: React.FC<GamePhaseManagerProps> = ({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}) => {
  const [week, setWeek] = React.useState(initialWeek);
  const [players, setPlayers] = React.useState(initialPlayers);
  const [phase, setPhase] = React.useState(initialPhase);
  const [hoh, setHoH] = React.useState<string | null>(null);
  const [veto, setVeto] = React.useState<string | null>(null);
  const [nominees, setNominees] = React.useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  const [statusMessage, setStatusMessage] = React.useState('');
  const { toast } = useToast();
  const { alliances, usePowerup } = useGameContext();

  const handlePlayerSelect = (playerId: string) => {
    if (phase === 'Nomination Ceremony') {
      // For nominations, allow selecting up to 2 players
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      } else if (selectedPlayers.length < 2) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    } else {
      // For other phases, select only one player
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers([]);
      } else {
        setSelectedPlayers([playerId]);
      }
    }
  };

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'selectHOH':
        if (selectedPlayers.length === 1) {
          const hohId = selectedPlayers[0];
          setHoH(hohId);
          
          // Update player status
          setPlayers(players.map(player => ({
            ...player,
            status: player.id === hohId ? 'hoh' : (player.status === 'hoh' ? undefined : player.status)
          })));
          
          setStatusMessage(`${players.find(p => p.id === hohId)?.name} is the new Head of Household!`);
          
          // Move to next phase
          toast({
            title: "New Head of Household",
            description: `${players.find(p => p.id === hohId)?.name} is the new HoH!`,
          });
          
          setTimeout(() => {
            setPhase('Nomination Ceremony');
            setSelectedPlayers([]);
            setStatusMessage('');
          }, 1500);
        }
        break;
        
      case 'nominate':
        if (selectedPlayers.length === 2) {
          // Check if any nominees have immunity
          const immuneNominee = players.find(p => 
            selectedPlayers.includes(p.id) && p.powerup === 'immunity'
          );
          
          if (immuneNominee) {
            usePowerup(immuneNominee.id);
            
            // Replace the immune nominee with another player
            const availablePlayers = players.filter(p => 
              !selectedPlayers.includes(p.id) && 
              p.id !== hoh && 
              p.status !== 'evicted' &&
              p.powerup !== 'immunity'
            );
            
            if (availablePlayers.length > 0) {
              const replacementIndex = Math.floor(Math.random() * availablePlayers.length);
              const replacementId = availablePlayers[replacementIndex].id;
              
              const updatedNominees = selectedPlayers.filter(id => id !== immuneNominee.id);
              updatedNominees.push(replacementId);
              
              setNominees(updatedNominees);
              
              // Update player status
              setPlayers(players.map(player => ({
                ...player,
                status: updatedNominees.includes(player.id) 
                  ? 'nominated' 
                  : (player.id === immuneNominee.id ? 'safe' : 
                     (player.status === 'nominated' ? undefined : player.status))
              })));
              
              const nominee1 = players.find(p => p.id === updatedNominees[0])?.name;
              const nominee2 = players.find(p => p.id === updatedNominees[1])?.name;
              
              setStatusMessage(`${immuneNominee.name} used immunity! ${nominee1} and ${nominee2} are now nominated for eviction!`);
            }
          } else {
            setNominees(selectedPlayers);
            
            // Update player status
            setPlayers(players.map(player => ({
              ...player,
              status: selectedPlayers.includes(player.id) 
                ? 'nominated' 
                : (player.status === 'nominated' ? undefined : player.status)
            })));
            
            const nominee1 = players.find(p => p.id === selectedPlayers[0])?.name;
            const nominee2 = players.find(p => p.id === selectedPlayers[1])?.name;
            
            setStatusMessage(`${nominee1} and ${nominee2} have been nominated for eviction!`);
          }
          
          toast({
            title: "Nomination Ceremony",
            description: statusMessage,
          });
          
          setTimeout(() => {
            setPhase('PoV Competition');
            setSelectedPlayers([]);
            setStatusMessage('');
          }, 1500);
        }
        break;
        
      case 'selectVeto':
        if (selectedPlayers.length === 1) {
          const vetoId = selectedPlayers[0];
          setVeto(vetoId);
          
          // Update player status
          setPlayers(players.map(player => ({
            ...player,
            status: player.id === vetoId 
              ? 'veto' 
              : (player.status === 'veto' ? undefined : player.status)
          })));
          
          setStatusMessage(`${players.find(p => p.id === vetoId)?.name} has won the Power of Veto!`);
          
          toast({
            title: "Power of Veto",
            description: `${players.find(p => p.id === vetoId)?.name} has won the PoV!`,
          });
          
          setTimeout(() => {
            setPhase('Veto Ceremony');
            setSelectedPlayers([]);
            setStatusMessage('');
          }, 1500);
        }
        break;
        
      case 'vetoAction':
        // Check if any player has a veto nullifier
        const nullifier = players.find(p => p.powerup === 'nullify');
        
        if (nullifier && data === 'use') {
          // Use the nullifier
          usePowerup(nullifier.id);
          
          setStatusMessage(`${nullifier.name} used the Veto Nullifier! The Power of Veto has been nullified this week.`);
          
          toast({
            title: "Veto Nullified",
            description: statusMessage,
          });
          
          setTimeout(() => {
            setPhase('Eviction Voting');
            setSelectedPlayers([]);
          }, 1500);
          
          break;
        }
        
        if (data === 'use') {
          // If using veto, go to replacement nominee selection
          // For simplicity, we'll just randomly select a replacement
          const availablePlayers = players.filter(p => 
            !nominees.includes(p.id) && 
            p.id !== hoh && 
            p.id !== veto &&
            p.status !== 'evicted'
          );
          
          if (availablePlayers.length > 0) {
            // Randomly select which nominee to save
            const savedNomineeIndex = Math.floor(Math.random() * nominees.length);
            const savedNomineeId = nominees[savedNomineeIndex];
            const remainingNomineeId = nominees.find(id => id !== savedNomineeId)!;
            
            // Randomly select a replacement nominee
            const replacementIndex = Math.floor(Math.random() * availablePlayers.length);
            const replacementId = availablePlayers[replacementIndex].id;
            
            const newNominees = [remainingNomineeId, replacementId];
            setNominees(newNominees);
            
            // Update player status
            setPlayers(players.map(player => ({
              ...player,
              status: newNominees.includes(player.id) 
                ? 'nominated' 
                : (player.id === savedNomineeId 
                    ? undefined 
                    : player.status)
            })));
            
            const savedName = players.find(p => p.id === savedNomineeId)?.name;
            const replacementName = players.find(p => p.id === replacementId)?.name;
            
            setStatusMessage(`${players.find(p => p.id === veto)?.name} used the Power of Veto on ${savedName}! ${replacementName} has been named as the replacement nominee.`);
          } else {
            setStatusMessage(`${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`);
          }
        } else {
          // Not using veto
          setStatusMessage(`${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`);
        }
        
        toast({
          title: "Veto Ceremony",
          description: statusMessage,
        });
        
        setTimeout(() => {
          setPhase('Eviction Voting');
          setSelectedPlayers([]);
        }, 1500);
        break;
        
      case 'evict':
        if (data) {
          const evictedId = data;
          
          // Check for coup d'état
          const coupPlayer = players.find(p => p.powerup === 'coup');
          if (coupPlayer) {
            usePowerup(coupPlayer.id);
            
            // Prevent eviction and force a new HoH competition
            setStatusMessage(`${coupPlayer.name} used the Coup d'État power! The eviction has been canceled and a new HoH will be selected!`);
            
            toast({
              title: "Coup d'État",
              description: statusMessage,
              variant: "destructive"
            });
            
            setTimeout(() => {
              setHoH(null);
              setNominees([]);
              setPhase('HoH Competition');
              setSelectedPlayers([]);
              setStatusMessage('');
            }, 1500);
            
            break;
          }
          
          // Update player status
          setPlayers(players.map(player => ({
            ...player,
            status: player.id === evictedId ? 'evicted' : player.status
          })));
          
          setSelectedPlayers([evictedId]);
          
          const evictedName = players.find(p => p.id === evictedId)?.name;
          const voteCount = Math.floor(Math.random() * 5) + 3; // Random vote count between 3-7
          
          setStatusMessage(`${evictedName} has been evicted by a vote of ${voteCount}-${Math.floor(Math.random() * 3)}.`);
          
          toast({
            title: "Eviction",
            description: `${evictedName} has been evicted from the Big Brother house`,
            variant: "destructive"
          });
          
          setTimeout(() => {
            setPhase('Eviction');
          }, 1500);
        }
        break;
        
      case 'nextWeek':
        // Check if we should have a special competition
        const hasSpecialComp = week % 3 === 0 || Math.random() < 0.2; // Every 3rd week or 20% chance
        
        if (hasSpecialComp) {
          // Reset player statuses except for evicted players
          setPlayers(players.map(player => ({
            ...player,
            status: player.status === 'evicted' ? 'evicted' : undefined
          })));
          
          setHoH(null);
          setVeto(null);
          setNominees([]);
          setSelectedPlayers([]);
          setPhase('Special Competition');
          
          toast({
            title: "Special Competition",
            description: "A special competition is taking place!",
          });
        } else {
          // Reset game state for next week
          setWeek(week + 1);
          setPhase('HoH Competition');
          setHoH(null);
          setVeto(null);
          setNominees([]);
          setSelectedPlayers([]);
          setStatusMessage('');
          
          // Reset player statuses except for evicted players
          setPlayers(players.map(player => ({
            ...player,
            status: player.status === 'evicted' ? 'evicted' : undefined
          })));
          
          toast({
            title: `Week ${week + 1}`,
            description: `Starting week ${week + 1}`,
          });
        }
        break;

      case 'specialCompetition':
        // Award a random power-up to the winner
        if (selectedPlayers.length === 1) {
          const winnerId = selectedPlayers[0];
          const powerupTypes: PlayerData['powerup'][] = ['immunity', 'coup', 'replay', 'nullify'];
          const randomPowerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
          
          // Update the player with the new power-up
          setPlayers(players.map(player => {
            if (player.id === winnerId) {
              return {
                ...player,
                powerup: randomPowerup
              };
            }
            return player;
          }));
          
          const winnerName = players.find(p => p.id === winnerId)?.name;
          setStatusMessage(`${winnerName} has won the special competition and earned a power-up!`);
          
          toast({
            title: "Special Competition",
            description: `${winnerName} has won a special power!`,
          });
          
          // Move to next week
          setTimeout(() => {
            setWeek(week + 1);
            setPhase('HoH Competition');
            setSelectedPlayers([]);
            setStatusMessage('');
          }, 1500);
        }
        break;
    }
  };

  return {
    week,
    phase,
    players,
    nominees,
    hoh,
    veto,
    statusMessage,
    selectedPlayers,
    handlePlayerSelect,
    handleAction,
    setWeek,
    setPhase
  };
};

export default GamePhaseManager;
