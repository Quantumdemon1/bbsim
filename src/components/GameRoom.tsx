
import React, { useState } from 'react';
import WeekSidebar from './WeekSidebar';
import GamePhaseDisplay from './GamePhaseDisplay';
import { PlayerData } from './PlayerProfile';
import { useToast } from "@/components/ui/use-toast";

interface GameRoomProps {
  players: PlayerData[];
  initialWeek?: number;
}

const GameRoom: React.FC<GameRoomProps> = ({ 
  players: initialPlayers, 
  initialWeek = 1 
}) => {
  const [week, setWeek] = useState(initialWeek);
  const [players, setPlayers] = useState(initialPlayers);
  const [phase, setPhase] = useState('HoH Competition');
  const [hoh, setHoH] = useState<string | null>(null);
  const [veto, setVeto] = useState<string | null>(null);
  const [nominees, setNominees] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();

  const phases = [
    'HoH Competition',
    'Nomination Ceremony',
    'PoV Competition',
    'Veto Ceremony',
    'Eviction Voting',
    'Eviction'
  ];

  const handleWeekChange = (newWeek: number) => {
    // In a real app, we would fetch the data for the selected week
    setWeek(newWeek);
    setPhase('HoH Competition');
    setSelectedPlayers([]);
    setStatusMessage('');
    toast({
      title: `Week ${newWeek}`,
      description: `Moved to week ${newWeek}`,
    });
  };

  const handlePhaseChange = (newPhase: string) => {
    setPhase(newPhase);
    setSelectedPlayers([]);
    setStatusMessage('');
  };

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
          
          toast({
            title: "Nomination Ceremony",
            description: `${nominee1} and ${nominee2} have been nominated`,
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
        break;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <WeekSidebar 
        currentWeek={week} 
        onWeekChange={handleWeekChange} 
        phases={phases}
        activePhase={phase}
        onPhaseChange={handlePhaseChange}
      />
      
      <GamePhaseDisplay 
        phase={phase}
        week={week}
        players={players}
        nominees={nominees}
        hoh={hoh}
        veto={veto}
        onAction={handleAction}
        statusMessage={statusMessage}
        selectedPlayers={selectedPlayers}
        onPlayerSelect={handlePlayerSelect}
      />
    </div>
  );
};

export default GameRoom;
