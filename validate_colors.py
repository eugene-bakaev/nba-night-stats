import json
import re

with open('frontend/src/team_colors.json', 'r') as f:
    data = json.load(f)

hex_pattern = re.compile(r'^#[0-9A-Fa-f]{6}$')

for team, info in data.items():
    for color in info['colors']:
        if not hex_pattern.match(color):
            print(f"Invalid color for {team}: {color}")
