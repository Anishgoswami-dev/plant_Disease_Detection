import json
import re

with open(r'C:\Users\ANISH\.gemini\antigravity-ide\brain\139b45ce-49a1-4acc-a923-195ab51b8ebc\.system_generated\logs\transcript_full.jsonl', encoding='utf-8') as f:
    text = f.read()

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TARGET_DIRS = [
    BASE_DIR / "sih 2026" / "backend" / "data",
    BASE_DIR / "sih 2026" / "ml" / "data"
]
for td in TARGET_DIRS:
    td.mkdir(parents=True, exist_ok=True)

# 1. crop recommendation
match_crop = re.search(r'(90,42,43,20\.87974371[\s\S]+?)(?=scheme_id|"scheme_id|\\\"scheme_id)', text)
if match_crop:
    raw_crop = match_crop.group(1).replace('\\n', '\n')
    lines = [l.strip() for l in raw_crop.splitlines() if ',' in l and len(l.split(',')) == 8]
    header = 'N,P,K,temperature,humidity,ph,rainfall,label'
    clean_lines = [header] + [l for l in lines if not l.startswith('N,P')]
    clean_csv = '\n'.join(clean_lines)
    for td in TARGET_DIRS:
        p = td / "crop_recommendation.csv"
        with open(p, 'w', encoding='utf-8') as out:
            out.write(clean_csv)
    print('Crop recommendation CSV saved! Rows:', len(clean_lines))

# 2. Schemes CSV
match_schemes = re.search(r'(MHAG001,Namo Shetkari Mahasanmaan[\s\S]+?)(?=\{\\n|\{\s*\"|\{\s*\\\"|\Z)', text)
if match_schemes:
    raw_s = match_schemes.group(1).replace('\\n', '\n')
    lines_s = [l.strip() for l in raw_s.splitlines() if l.startswith('MHAG')]
    header_s = 'scheme_id,scheme_name,category,government,department,description,beneficiary,eligibility,benefits,required_documents,application_mode,official_link,status'
    clean_s = header_s + '\n' + '\n'.join(lines_s)
    for td in TARGET_DIRS:
        p = td / "government_schemes.csv"
        with open(p, 'w', encoding='utf-8') as out:
            out.write(clean_s)
    print('Government schemes CSV saved! Rows:', len(lines_s))

# 3. Schemes JSON
match_json = re.search(r'(\{\\n\s*\\\"MHAG001\\\"[\s\S]+?MHAG100[\s\S]+?\\n\})', text)
if not match_json:
    match_json = re.search(r'(\{\s*\"MHAG001\"[\s\S]+?MHAG100[\s\S]+?\n\})', text)

if match_json:
    raw_j = match_json.group(1)
    # clean JSON escapes
    cleaned = raw_j.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
    try:
        parsed = json.loads(cleaned)
        print('Government schemes JSON valid! Total entries:', len(parsed))
        for td in TARGET_DIRS:
            p = td / "government_schemes.json"
            with open(p, 'w', encoding='utf-8') as out:
                json.dump(parsed, out, indent=2)
        print('Government schemes JSON saved successfully!')
    except Exception as e:
        print('JSON error:', e)
