from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import httpx
import os
from datetime import datetime, timedelta
from typing import Optional

from models import GameResponse
from services.cache import read_cache, write_cache
from services.nba import fetch_nba_deltas, fetch_upcoming_games

async def keep_alive_loop():
    """
    Infinite loop that pings the public Render URL every 10 minutes 
    to prevent the free tier container from spinning down.
    """
    url = os.getenv("RENDER_EXTERNAL_URL")
    if not url:
        print("No RENDER_EXTERNAL_URL found, skipping keep-alive loop.")
        return
    
    print(f"Starting keep-alive loop for {url}")
    # We use a separate client to avoid session issues in the infinite loop
    async with httpx.AsyncClient() as client:
        while True:
            await asyncio.sleep(600) # Wait 10 minutes
            try:
                print(f"Sending keep-alive ping to {url}/api/ping...")
                await client.get(f"{url}/api/ping")
            except Exception as e:
                print(f"Self-ping failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the keep-alive loop as a background task
    task = asyncio.create_task(keep_alive_loop())
    yield
    # Clean up on shutdown
    task.cancel()

app = FastAPI(title="NBA Night Stats API", lifespan=lifespan)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ping")
async def ping():
    """Simple endpoint for keep-alive pings."""
    return {"status": "ok", "message": "Keep-alive ping received"}

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
        
        # Also fetch upcoming games starting from today
        today = datetime.now().strftime('%Y-%m-%d')
        up_date, up_games = fetch_upcoming_games(today)
        
        response_data = {
            "game_date": yesterday,
            "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "games": games,
            "upcoming_date": up_date,
            "upcoming_games": up_games
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
