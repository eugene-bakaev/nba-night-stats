from nba_api.stats.endpoints import scoreboardv3
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

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
        
        # Only process games that have actually been played (non-zero scores)
        if home_abbr and away_abbr and (home_score > 0 or away_score > 0):
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

def fetch_upcoming_games(start_date_str: str) -> tuple[Optional[str], List[Dict[str, Any]]]:
    """Scans forward from start_date to find up to 3 next games within a 5-day window."""
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    all_upcoming = []
    first_date = None
    
    for i in range(5): # Scan up to 5 days
        current_date_str = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
        sb = scoreboardv3.ScoreboardV3(game_date=current_date_str)
        data = sb.get_dict()
        games_list = data.get('scoreboard', {}).get('games', [])
        
        if games_list:
            if not first_date:
                first_date = current_date_str
                
            for g in games_list:
                home = g.get('homeTeam', {})
                away = g.get('awayTeam', {})
                
                # Handle TBD teams
                home_abbr = home.get('teamTricode') or "TBD"
                away_abbr = away.get('teamTricode') or "TBD"
                
                all_upcoming.append({
                    "teams": [away_abbr, home_abbr],
                    "time": g.get('gameStatusText') or "TBD",
                    "game_date": current_date_str,
                    "status": "Scheduled"
                })
                
                if len(all_upcoming) >= 3:
                    return first_date, all_upcoming
            
    return first_date, all_upcoming
