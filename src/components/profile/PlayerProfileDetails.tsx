
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  User, 
  UserCheck, 
  MessageSquare, 
  Settings, 
  Heart, 
  Shield, 
  Activity,
  Edit
} from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { toast } from "@/components/ui/use-toast";
import { PlayerAttributes } from '@/hooks/game-phases/types';

interface PlayerProfileDetailsProps {
  player: PlayerData;
  isCurrentPlayer?: boolean;
  onEdit?: () => void;
}

const PlayerProfileDetails: React.FC<PlayerProfileDetailsProps> = ({ 
  player, 
  isCurrentPlayer = false,
  onEdit
}) => {
  const { currentPlayer, isGuest } = useGameContext();
  const [activeTab, setActiveTab] = useState('info');
  
  const handleFriendRequest = () => {
    toast({
      title: "Friend Request Sent",
      description: `Your friend request to ${player.name} has been sent.`,
    });
  };
  
  const handleMessage = () => {
    toast({
      title: "Chat Opened",
      description: `Starting a private chat with ${player.name}.`,
    });
  };
  
  // Calculate attributes stats for the radar chart
  const getAttributePercentage = (attribute?: number) => {
    if (!attribute) return 0;
    return (attribute / 5) * 100;
  };
  
  return (
    <Card className="bg-game-dark border-game-accent text-white w-full max-w-3xl">
      <CardHeader className="relative">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 bg-game-medium rounded-full overflow-hidden">
            {player.image ? (
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-4 text-white" />
            )}
            {player.status && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-game-accent rounded-full flex items-center justify-center text-xs font-bold">
                {player.status === 'hoh' ? 'H' : 
                 player.status === 'veto' ? 'V' : 
                 player.status === 'nominated' ? 'N' : 
                 player.status === 'evicted' ? 'E' : 
                 player.status === 'winner' ? 'W' : 
                 player.status === 'juror' ? 'J' : ''}
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-xl text-game-accent">
              {player.name}
              {isGuest && isCurrentPlayer && " (Guest)"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {player.age && `${player.age} years old • `}
              {player.hometown && `${player.hometown} • `}
              {player.occupation && player.occupation}
            </CardDescription>
          </div>
        </div>
        
        {isCurrentPlayer && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-4 bg-transparent border-game-accent text-game-accent hover:bg-game-accent hover:text-black"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-game-medium grid grid-cols-4 mb-2 mx-6">
          <TabsTrigger value="info" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <User className="h-4 w-4 mr-2" />
            Info
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Trophy className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Activity className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-game-accent data-[state=active]:text-black">
            <Heart className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="pb-4">
          <TabsContent value="info" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Bio</h3>
                <p className="mt-1">{player.bio || "No bio available."}</p>
              </div>
              
              {player.alliances && player.alliances.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Alliances</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {player.alliances.map((alliance, index) => (
                      <div key={index} className="px-2 py-1 bg-game-medium rounded-full text-xs flex items-center">
                        <Shield className="h-3 w-3 mr-1 text-game-accent" />
                        {alliance}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {player.powerup && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Power-up</h3>
                  <div className="px-2 py-1 bg-game-medium rounded-full text-xs inline-flex items-center mt-1">
                    {player.powerup.charAt(0).toUpperCase() + player.powerup.slice(1)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <div className="space-y-4">
              {player.stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">HoH Wins</span>
                      <span className="font-medium">{player.stats.hohWins || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">PoV Wins</span>
                      <span className="font-medium">{player.stats.povWins || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Times Nominated</span>
                      <span className="font-medium">{player.stats.timesNominated || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Days in House</span>
                      <span className="font-medium">{player.stats.daysInHouse || 0}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Competitions Won</span>
                      <span className="font-medium">{player.stats.competitionsWon || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Jury Votes</span>
                      <span className="font-medium">{player.stats.juryVotes || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Final Placement</span>
                      <span className="font-medium">{player.stats.placement ? `${player.stats.placement}${getOrdinalSuffix(player.stats.placement)}` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!player.stats && (
                <p className="text-gray-400">No stats available for this player yet.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-0">
            {player.attributes ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(player.attributes).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{formatAttributeName(key)}</span>
                        <span>{value}/5</span>
                      </div>
                      <div className="h-2 bg-game-medium rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-game-accent"
                          style={{ width: `${getAttributePercentage(value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No skill attributes available for this player yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            {player.relationships && player.relationships.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400">Relationships</h3>
                <div className="space-y-2">
                  {player.relationships.map((relationship) => {
                    const targetPlayer = relationship.targetId; // In a real app, we would look up the player
                    const relationshipColor = getRelationshipColor(relationship.type);
                    
                    return (
                      <div key={relationship.targetId} className="flex items-center justify-between p-2 bg-game-medium/40 rounded">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-game-medium flex items-center justify-center mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm">{targetPlayer}</div>
                            <div className="text-xs" style={{ color: relationshipColor }}>
                              {relationship.type}
                              {relationship.isMutual && " (Mutual)"}
                            </div>
                          </div>
                        </div>
                        <div 
                          className="w-2 h-10 rounded-full" 
                          style={{ backgroundColor: relationshipColor }} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No relationships data available for this player yet.</p>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-end space-x-2">
        {!isCurrentPlayer && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-game-accent text-game-accent hover:bg-game-accent hover:text-black"
              onClick={handleFriendRequest}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Add Friend
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-game-accent text-game-accent hover:bg-game-accent hover:text-black"
              onClick={handleMessage}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

// Helper functions
function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

function formatAttributeName(name: string): string {
  if (name === 'mentalQuiz') return 'Mental Quiz';
  return name.replace(/([A-Z])/g, ' $1').toLowerCase();
}

function getRelationshipColor(type: string): string {
  switch(type) {
    case 'Ride or Die': return '#4ade80'; // Green
    case 'Strong Bond': return '#22c55e';
    case 'Medium Bond': return '#10b981';
    case 'Small Bond': return '#059669';
    case 'Slight Bond': return '#047857';
    case 'Neutral': return '#6b7280'; // Gray
    case 'Slight Dislike': return '#f87171';
    case 'Mild Dislike': return '#ef4444';
    case 'Dislike': return '#dc2626';
    case 'Strong Dislike': return '#b91c1c';
    case 'Nemesis': return '#7f1d1d'; // Dark red
    default: return '#6b7280';
  }
}

export default PlayerProfileDetails;
