
export interface PlayerData {
  id: string;
  name: string;
  image?: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted' | 'winner' | 'juror' | 'runner-up';
  powerup?: 'immunity' | 'nullify' | 'coup' | 'replay';
  attributes?: {
    [key: string]: number;
  };
  relationships?: Array<{
    targetId: string;
    type: string;
    value: number;
  }>;
  stats?: {
    hohWins?: number;
    povWins?: number;
    timesNominated?: number;
    daysInHouse?: number;
    juryVotes?: number;
    placement?: number;
  };
}
