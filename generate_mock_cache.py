import json
from datetime import datetime, timedelta
import random

with open('frontend/src/team_colors.json', 'r') as f:
    team_data = json.load(f)

teams = list(team_data.keys())
games = []

# Pair them up (30 teams = 15 games)
for i in range(0, len(teams), 2):
    if i + 1 < len(teams):
        # Generate random cumulative deltas that make sense
        q1 = random.randint(2, 10)
        q2 = q1 + random.randint(-5, 10)
        q3 = q2 + random.randint(-5, 10)
        q4 = q3 + random.randint(-5, 10)
        
        period_deltas = [
            {"period": 1, "delta": abs(q1)},
            {"period": 2, "delta": abs(q2)},
            {"period": 3, "delta": abs(q3)},
            {"period": 4, "delta": abs(q4)}
        ]

        games.append({
            "teams": [teams[i], teams[i+1]],
            "delta": abs(q4),
            "period_deltas": period_deltas
        })

yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
mock_cache = {
    "game_date": yesterday,
    "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    "games": games
}

with open('cache.json', 'w') as f:
    json.dump(mock_cache, f, indent=2)

print(f"Generated mock cache with {len(games)} games (with period deltas) covering {len(teams)} teams.")
