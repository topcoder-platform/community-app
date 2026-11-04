#!/usr/bin/env python3
"""Pass the reviewed manifest and this job's prebuilt images to the pinned suite."""
import json
from pathlib import Path
import subprocess
import sys

manifest = Path(sys.argv[1])
data = json.loads(manifest.read_text())
command = [sys.executable, '-I', '/tmp/tc-deploy-scripts/tcdeploy.py', 'deploy', '--manifest', str(manifest),
           '--bootstrap-health-checks', str(manifest.with_name(data['environment'] + '-healthcheck.json'))]
for container in data['images']:
    command.extend(['--image', container + '=community-app:candidate'])
subprocess.run(command, check=True)
