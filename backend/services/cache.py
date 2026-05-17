import json
import os
from typing import Optional, Dict, Any

CACHE_FILE = "cache.json"

def read_cache(target_date: str) -> Optional[Dict[str, Any]]:
    """Reads and validates the local cache for a specific date."""
    if not os.path.exists(CACHE_FILE):
        return None
        
    try:
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
            
            # Basic validation
            if not isinstance(cache, dict) or cache.get("game_date") != target_date:
                return None
                
            # Version 2 check (ensure period_deltas exist if games are present)
            games = cache.get("games", [])
            if games and "period_deltas" not in games[0]:
                return None
                
            return cache
            
    except (json.JSONDecodeError, IOError, IndexError, KeyError):
        return None

def write_cache(data: Dict[str, Any]) -> None:
    """Writes the game data to the local cache file."""
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except IOError as e:
        print(f"Error writing to cache: {e}")
