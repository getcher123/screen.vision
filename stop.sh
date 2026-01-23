#!/usr/bin/env bash
set -euo pipefail

pkill -f "uvicorn api.index:app" || true
pkill -f "next start" || true

echo "Stopped backend (uvicorn) and frontend (next start)."
