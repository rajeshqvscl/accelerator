#!/usr/bin/env python3
"""Start both the backend API and frontend dev server for local development."""

import subprocess
import sys
import os
import signal
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_PORT = 4173
FRONTEND_PORT = 4174

procs = []

def cleanup(signum=None, frame=None):
    for p in procs:
        p.terminate()
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

print("Starting QVSCL Accelerator...")
print(f"  Backend API:  http://127.0.0.1:{BACKEND_PORT}")
print(f"  Frontend:     http://127.0.0.1:{FRONTEND_PORT}")
print("  Press Ctrl+C to stop both.\n")

backend = subprocess.Popen(
    [sys.executable, os.path.join(ROOT, "backend", "server.py"), "--port", str(BACKEND_PORT)],
    cwd=ROOT
)
procs.append(backend)

frontend = subprocess.Popen(
    [sys.executable, os.path.join(ROOT, "frontend", "serve.py"), "--port", str(FRONTEND_PORT)],
    cwd=ROOT
)
procs.append(frontend)

try:
    while all(p.poll() is None for p in procs):
        time.sleep(1)
except KeyboardInterrupt:
    cleanup()
