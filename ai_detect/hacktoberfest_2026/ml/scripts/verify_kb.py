import sys, json
sys.path.insert(0, 'app')
from knowledge_base import DISEASE_KNOWLEDGE_BASE, get_agronomy_info

print(f'KB entries: {len(DISEASE_KNOWLEDGE_BASE)}')
new_keys = [
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Spider_mites Two-spotted_spider_mite',
]
for k in new_keys:
    info = get_agronomy_info(k)
    in_kb = k in DISEASE_KNOWLEDGE_BASE
    status = 'OK    ' if in_kb else 'FALLBACK'
    print(f'  {status} {k[:60]}')

with open('models/class_indices.json') as f:
    cmap = json.load(f)
classes = [cmap[str(i)] for i in range(38)]
missing = [c for c in classes if c not in DISEASE_KNOWLEDGE_BASE]
print(f'\nCoverage: {38-len(missing)}/38 classes in KB')
if missing:
    print('Still missing:')
    for m in missing:
        print(f'  - {m}')
else:
    print('All 38 classes now have KB entries!')
