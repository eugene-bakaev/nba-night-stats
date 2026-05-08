from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional

from models import GameResponse
from services.cache import read_cache, write_cache
from services.nba import fetch_nba_deltas

app = FastAPI(title="NBA Night Stats API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/deltas", response_model=GameResponse)
async def get_deltas(force: bool = False):
    """
    Fetches NBA game score deltas for 'yesterday'.
    Uses local caching by default.
    """
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    # 1. Try to serve from cache
    if not force:
        cached_data = read_cache(yesterday)
        if cached_data:
            print(f"Serving from cache for date: {yesterday}")
            return GameResponse(**cached_data)
    
    # 2. Fetch fresh data from NBA API
    print(f"Fetching from NBA API for date: {yesterday} (Force: {force})")
    try:
        games = fetch_nba_deltas(yesterday)
        
        response_data = {
            "game_date": yesterday,
            "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "games": games
        }
        
        # 3. Update cache
        write_cache(response_data)
            
        return GameResponse(**response_data)

    except Exception as e:
        print(f"Error fetching NBA data: {e}")
        return GameResponse(
            game_date=yesterday,
            fetched_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            games=[],
            error=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
