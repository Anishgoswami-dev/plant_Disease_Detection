import os
import sys
from pathlib import Path

# Redirect to the actual script in hacktoberfest_2026/ml
CURRENT_DIR = Path(__file__).resolve().parent
TARGET_SCRIPT = CURRENT_DIR / "hacktoberfest_2026" / "ml" / "test_inference.py"

if not TARGET_SCRIPT.exists():
    # Try direct ml folder if root changed
    TARGET_SCRIPT = CURRENT_DIR / "ml" / "test_inference.py"

if TARGET_SCRIPT.exists():
    # Pass execution to test_inference.py
    import subprocess
    cmd = [sys.executable, str(TARGET_SCRIPT)] + sys.argv[1:]
    sys.exit(subprocess.call(cmd))
else:
    print(f"Error: Could not locate test_inference.py at {TARGET_SCRIPT}")
    sys.exit(1)
