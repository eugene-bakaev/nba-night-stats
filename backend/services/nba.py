from nba_api.stats.endpoints import scoreboardv3
from typing import List, Dict, Any

def fetch_nba_deltas(game_date: str) -> List[Dict[str, Any]]:
    """Fetches and processes NBA game data for a specific date."""
    sb = scoreboardv3.ScoreboardV3(game_date=game_date)
    data = sb.get_dict()
    
    games_list = data.get('scoreboard', {}).get('games', [])
    processed_games = []
    
    for game in games_list:
        home_team = game.get('homeTeam', {})
        away_team = game.get('awayTeam', {})
        
        home_abbr = home_team.get('teamTricode')
        away_abbr = away_team.get('teamTricode')
        home_score = home_team.get('score', 0)
        away_score = away_team.get('score', 0)
        
        if home_abbr and away_abbr:
            # Calculate cumulative period deltas
            home_periods = home_team.get('periods', [])
            away_periods = away_team.get('periods', [])
            
            period_deltas = []
            home_running = 0
            away_running = 0
            
            for hp, ap in zip(home_periods, away_periods):
                home_running += hp.get('score', 0)
                away_running += ap.get('score', 0)
                period_deltas.append({
                    "period": hp.get('period'),
                    "delta": abs(home_running - away_running)
                })

            processed_games.append({
                "teams": [home_abbr, away_abbr],
                "delta": abs(home_score - away_score),
                "period_deltas": period_deltas
            })
            
    return processed_games
