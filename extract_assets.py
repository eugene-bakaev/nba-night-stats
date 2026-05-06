import os
import json
import shutil
from bs4 import BeautifulSoup

# Paths
html_path = 'nba_logos/logos.html'
output_logos_dir = 'frontend/public/logos'
output_json_path = 'frontend/src/team_colors.json'

# Ensure output dir exists
os.makedirs(output_logos_dir, exist_ok=True)

# Tricode mapping fixes
TRICODE_FIXES = {
    'NWO': 'NOP',
    'UTH': 'UTA'
}

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find all cards in the album
cards = soup.select('.album .card')

team_data = {}

print(f"Found {len(cards)} cards to process...")

for card in cards:
    # Get the main image
    img_tag = card.select_one('.card-body > .card-img-top')
    if not img_tag:
        continue
    
    # Get the tricode from the button
    btn = card.select_one('button[data-target^="#logo-nba-"]')
    if not btn:
        continue
        
    target_id = btn['data-target'] # e.g. #logo-nba-atl
    raw_abbr = target_id.split('-')[-1].upper()
    tricode = TRICODE_FIXES.get(raw_abbr, raw_abbr)
    
    # Extract colors from the specific div following the team name
    color_div = card.select_one('.card-body > .card-img-top + div + div')
    colors = []
    if color_div:
        color_spans = color_div.select('span[data-original-title]')
        for span in color_spans:
            color = span['data-original-title']
            if color and color.startswith('#'):
                colors.append(color)
    
    # Get the source file path
    src_path = img_tag['src'] # e.g. ./logos_files/atlanta-hawks.svg
    # The src in HTML is relative to the HTML file
    source_file = os.path.join('nba_logos', src_path)
    
    # Determine destination filename (keep extension)
    ext = os.path.splitext(src_path)[1]
    dest_filename = f"{tricode}{ext}"
    dest_path = os.path.join(output_logos_dir, dest_filename)
    
    # Copy file
    if os.path.exists(source_file):
        shutil.copy(source_file, dest_path)
        print(f"Copied {tricode} logo.")
    else:
        print(f"Warning: Source file not found: {source_file}")
        
    # Store team metadata
    team_data[tricode] = {
        "colors": colors,
        "logo": f"/logos/{dest_filename}"
    }

# Save JSON
with open(output_json_path, 'w') as f:
    json.dump(team_data, f, indent=2)
    print(f"Saved team colors and logo paths to {output_json_path}")
