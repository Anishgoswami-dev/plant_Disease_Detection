import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Insert back button before extension-badge-row (line 8563 = index 8562)
# Find the line with extension-badge-row inside extension-hero-content
insert_before = None
for i, line in enumerate(lines):
    if 'extension-badge-row' in line and 'extension-hero-content' in lines[i-1]:
        insert_before = i
        break

if insert_before is None:
    # fallback: find it differently
    for i, line in enumerate(lines):
        if 'extension-role-badge' in line:
            # go back to find the extension-badge-row div
            for j in range(i-1, i-5, -1):
                if 'extension-badge-row' in lines[j]:
                    insert_before = j
                    break
            break

print(f"Will insert before line {insert_before + 1}: {repr(lines[insert_before])}")

back_btn = """          <button
            onClick={() => onSwitchRole && onSwitchRole()}
            style={{
              background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
              borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '5px 14px',
              display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px'
            }}
          >
            \u2039 {t.backToHome || 'Back to Farmer View'}
          </button>
"""

if insert_before is not None:
    lines.insert(insert_before, back_btn)
    with open('frontend/src/main.jsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("SUCCESS: Back button inserted!")
else:
    print("FAILED: Could not find insertion point")
