import json
from datetime import datetime, timedelta

with open('frontend/src/team_colors.json', 'r') as f:
    team_data = json.load(f)

teams = list(team_data.keys())
games = []

# Pair them up (30 teams = 15 games)
for i in range(0, len(teams), 2):
    if i + 1 < len(teams):
        games.append({
            "teams": [teams[i], teams[i+1]],
            "delta": (i + 5) % 30 # Just some random-ish deltas
        })

yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
mock_cache = {
    "game_date": yesterday,
    "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    "games": games
}

with open('cache.json', 'w') as f:
    json.dump(mock_cache, f, indent=2)

print(f"Generated mock cache with {len(games)} games covering {len(teams)} teams.")
