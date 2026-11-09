#!/usr/bin/env bash
set -euo pipefail
target=development
if [[ "${NODE_CONFIG_ENV:-development}" == production ]]; then target=production; fi
python3 -I /tmp/tc-deploy-scripts/build_image.py --target "$target" --image community-app:candidate
