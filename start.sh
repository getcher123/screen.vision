#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT="${BACKEND_PORT:-8020}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
API_URL="${API_URL:-http://127.0.0.1:${BACKEND_PORT}/api}"
HOST="${HOST:-127.0.0.1}"

cd "$ROOT_DIR"

if [[ "${1:-}" == "--build-only" ]]; then
  source ~/.nvm/nvm.sh
  nvm use 20 >/dev/null
  corepack enable >/dev/null
  NEXT_PUBLIC_API_URL="$API_URL" pnpm build
  exit 0
fi

source ~/.nvm/nvm.sh
nvm use 20 >/dev/null
corepack enable >/dev/null
pnpm install

NEXT_PUBLIC_API_URL="$API_URL" pnpm build

source "$ROOT_DIR/.venv/bin/activate"
nohup uvicorn api.index:app --host "$HOST" --port "$BACKEND_PORT" > /tmp/screenvision-backend.log 2>&1 &

nohup pnpm start -- -p "$FRONTEND_PORT" -H "$HOST" > /tmp/screenvision-frontend.log 2>&1 &

echo "Frontend: http://${HOST}:${FRONTEND_PORT}"
echo "Backend:  http://${HOST}:${BACKEND_PORT}"
