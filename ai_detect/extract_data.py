import json
import re

transcript_path = r'C:\Users\ANISH\.gemini\antigravity-ide\brain\139b45ce-49a1-4acc-a923-195ab51b8ebc\.system_generated\logs\transcript_full.jsonl'
full_text = open(transcript_path, 'r', encoding='utf-8', errors='ignore').read()

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TARGET_DIRS = [
    BASE_DIR / "sih 2026" / "backend" / "data",
    BASE_DIR / "sih 2026" / "ml" / "data"
]
for td in TARGET_DIRS:
    td.mkdir(parents=True, exist_ok=True)

# Extract crop recommendation CSV
crop_csv_match = re.search(r'(N,P,K,temperature,humidity,ph,rainfall,label[\s\S]+?)(?=scheme_id|\"scheme_id|\Z)', full_text)
if crop_csv_match:
    crop_data = crop_csv_match.group(1).strip()
    # clean trailing markdown or JSON artifacts
    crop_lines = [l for l in crop_data.splitlines() if ',' in l and not l.startswith('{') and not l.startswith('"')]
    clean_crop = '\n'.join(crop_lines)
    for td in TARGET_DIRS:
        p = td / "crop_recommendation.csv"
        with open(p, 'w', encoding='utf-8') as f:
            f.write(clean_crop)
    print('Crop recommendation CSV saved, rows:', len(crop_lines))

# Extract government schemes CSV
schemes_csv_match = re.search(r'(scheme_id,scheme_name,category,government[\s\S]+?)(?=\{|\"\{|\Z)', full_text)
if schemes_csv_match:
    schemes_csv = schemes_csv_match.group(1).strip()
    scheme_lines = [l for l in schemes_csv.splitlines() if l.startswith('MHAG') or l.startswith('scheme_id')]
    clean_schemes = '\n'.join(scheme_lines)
    for td in TARGET_DIRS:
        p = td / "government_schemes.csv"
        with open(p, 'w', encoding='utf-8') as f:
            f.write(clean_schemes)
    print('Government schemes CSV saved, rows:', len(scheme_lines))

# Extract schemes JSON
schemes_json_match = re.search(r'(\{\\n\s*\\\"MHAG001\\\"[\s\S]+?\\n\})', full_text)
if not schemes_json_match:
    schemes_json_match = re.search(r'(\{\s*\"MHAG001\"[\s\S]+?\n\})', full_text)

if schemes_json_match:
    raw_j = schemes_json_match.group(1)
    # unescape if escaped
    if '\\"' in raw_j:
        raw_j = raw_j.encode('utf-8').decode('unicode_escape')
    try:
        parsed = json.loads(raw_j)
        print('Schemes JSON valid! Total entries:', len(parsed))
        for td in TARGET_DIRS:
            p = td / "government_schemes.json"
            with open(p, 'w', encoding='utf-8') as f:
                json.dump(parsed, f, indent=2)
        print('Government schemes JSON saved successfully!')
    except Exception as e:
        print('JSON parse error:', e)
