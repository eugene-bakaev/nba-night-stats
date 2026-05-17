export interface TeamInfo {
  colors: string[];
  logo: string;
}

export interface PeriodDelta {
  period: number;
  delta: number;
}

export interface Game {
  teams: [string, string];
  delta: number;
  period_deltas: PeriodDelta[];
}

export interface UpcomingGame {
  teams: string[];
  time: string;
  game_date: string;
  status: string;
}

export interface ApiResponse {
  games: Game[];
  game_date: string;
  fetched_at: string;
  upcoming_date?: string;
  upcoming_games: UpcomingGame[];
  error?: string;
}
