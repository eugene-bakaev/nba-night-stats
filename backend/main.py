from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import json
import os
from nba_api.stats.endpoints import scoreboardv3

app = FastAPI()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_FILE = "cache.json"

@app.get("/api/deltas")
async def get_deltas(force: bool = False):
    # Calculate yesterday's date in YYYY-MM-DD format
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    # Check cache first (unless force refresh is requested)
    if not force and os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                cache = json.load(f)
                # Ensure the cache structure is the new format
                if isinstance(cache, dict) and cache.get("game_date") == yesterday:
                    print(f"Serving from cache for date: {yesterday}")
                    return cache
                # If it's the old list format, force a refresh
        except (json.JSONDecodeError, IOError):
            pass
    
    # Fetch from NBA API
    print(f"Fetching from NBA API for date: {yesterday} (Force: {force})")
    try:
        sb = scoreboardv3.ScoreboardV3(game_date=yesterday)
        data = sb.get_dict()
        
        games_list = data.get('scoreboard', {}).get('games', [])
        
        deltas = []
        for game in games_list:
            home_team = game.get('homeTeam', {})
            away_team = game.get('awayTeam', {})
            
            home_abbr = home_team.get('teamTricode')
            away_abbr = away_team.get('teamTricode')
            home_score = home_team.get('score', 0)
            away_score = away_team.get('score', 0)
            
            if home_abbr and away_abbr:
                delta = abs(home_score - away_score)
                deltas.append({
                    "matchup": f"{home_abbr}-{away_abbr}",
                    "delta": delta
                })
        
        response_data = {
            "game_date": yesterday,
            "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "games": deltas
        }
        
        # Save to cache
        with open(CACHE_FILE, "w") as f:
            json.dump(response_data, f)
            
        return response_data

    except Exception as e:
        print(f"Error fetching NBA data: {e}")
        # Return structured error so frontend doesn't crash
        return {
            "game_date": yesterday,
            "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "games": [],
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
