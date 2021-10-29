export interface Team {
  id: string;
  isStarted?: boolean;
  player?: string[];
  score?: number;
  total?: number;
  playerInfo?: any[];
}

export interface Player {
  avatar: string;
  fullName: string;
}
