
export interface WeekSummary {
  week: number;
  hoh: string | null;
  nominees: string[];
  vetoWinner: string | null;
  vetoUsed: boolean;
  finalNominees?: string[];
  evicted: string | null;
  evictionVotes?: string;
  jurors?: string[];
  competitions?: {
    hoh?: {
      type: string;
      winner: string;
      results?: any;
    };
    veto?: {
      type: string;
      winner: string;
      results?: any;
    };
  };
  keyEvents?: {
    type: string;
    description: string;
    players: string[];
  }[];
}
