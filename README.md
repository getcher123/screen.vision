<div align="center">

# Screen Vision

### Get a guided tour for anything, right on your screen.

</div>

![Screen Vision Demo](demo.gif)

## How It Works

The system is straightforward:

1. **You describe your goal** — "I want to set up two-factor authentication on my Google account" or "Help me configure my Git SSH keys"

2. **You share your screen** — The app uses your browser's built-in screen sharing (the same tech used for video calls)

3. **AI analyzes what it sees** — Vision language models look at your screen and figure out the current state

4. **You get one instruction at a time** — No information overload. Just "Click the blue Settings button in the top right" or "Scroll down to find Security"

5. **Automatic progress detection** — When you complete a step, Screen Vision notices the screen changed and automatically gives you the next instruction

## Models Used

| Model              | Provider         | Purpose                                                                                |
| ------------------ | ---------------- | -------------------------------------------------------------------------------------- |
| **GPT-5.2**        | OpenAI           | Primary reasoning: generates step-by-step instructions and answers follow-up questions |
| **Gemini 3 Flash** | Google AI Studio | Step verification: compares before/after screenshots to confirm action completion      |
| **Qwen3-VL 30B**   | Fireworks AI     | Coordinate detection: locates specific UI elements on screen                           |

## Privacy & Security

Screen Vision is designed to process your data securely without retaining it.

- **Zero Data Retention**: No images or screen recordings are stored on the server. All processing happens in real-time, and data is discarded immediately after analysis.
- **Secure AI Processing**: Screenshots are sent to trusted LLM providers (OpenAI and Fireworks AI) solely for analysis. These providers adhere to strict data handling policies and do not store or use your data to train their models.
  - [OpenAI Enterprise Privacy](https://platform.openai.com/docs/guides/your-data)
  - [Fireworks AI Data Handling Policy](https://docs.fireworks.ai/guides/security_compliance/data_handling)

## Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS, Zustand
- **Backend**: FastAPI, Python
- **AI**: OpenAI GPT models, Qwen-VL (via DeepInfra)
- **UI**: Radix primitives, Framer Motion, Lucide icons

**Frontend (Next.js + React)**

- Handles screen capture via the MediaDevices API
- Runs change detection by comparing scaled-down frames
- Manages the PiP window for always-on-top instructions
- Masks its own window from screenshots (so the AI doesn't see itself)

**Backend (FastAPI + Python)**

- `/api/step` — Given a goal and screenshot, returns the next single instruction
- `/api/check` — Compares before/after screenshots to verify if a step was completed
- `/api/help` — Answers follow-up questions about what's on screen
- `/api/coordinates` — Locates specific UI elements when needed

## Self-Hosting

### Prerequisites

- Node.js 18+
- Python 3.10+
- pnpm (or npm/yarn)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/bullmeza/screen.vision.git
cd screen.vision

# Frontend
pnpm install

# Backend
pip install -r requirements.txt
```

### Configuration

Create a `.env.local` file in the root directory:

```bash
# Required - powers the main step-by-step logic
OPENAI_API_KEY=sk-...

# Required - used for verification/coordinates fallback (vision models via DeepInfra)
DEEPINFRA_KEY=...

# Optional - check endpoint uses Gemini directly if set
GEMINI_API_KEY=...
```

The app uses OpenAI for primary reasoning and DeepInfra for vision models in `/api/check` fallback and `/api/coordinates`. You can swap these out by modifying `api/index.py` if you prefer different providers.

### Running Locally

Start both the frontend and backend with a single command:

```bash
npm run dev
```

This runs:

- Next.js dev server on `http://localhost:3000`
- FastAPI server on `http://localhost:8000`

Open your browser to `http://localhost:3000` and you're good to go.

### Start/Stop scripts

Use the helper scripts to build and run the frontend + backend (production build) or stop them:

```bash
make start
make stop
```

Build only:

```bash
make build
```

Logs:
- Frontend: `/tmp/screenvision-frontend.log`
- Backend: `/tmp/screenvision-backend.log`

## Running on WSL (Windows)

WSL builds can fail in `/mnt/c` due to filesystem permissions. Run the project from your Linux home directory for best results.

```bash
# Copy the repo into WSL home (adjust path if needed)
rsync -a --delete --exclude node_modules --exclude .venv /mnt/c/screen.vision/ ~/screen.vision/
cd ~/screen.vision

# Install Node.js 20 via nvm (one-time)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
corepack enable
corepack prepare pnpm@10.21.0 --activate

# Install deps
pnpm install
python3 -m virtualenv .venv
.venv/bin/pip install -r requirements.txt

# Run (frontend + backend)
NEXT_PUBLIC_API_URL="http://127.0.0.1:8020/api" \
  pnpm run next-dev -- --port 3000 --hostname 127.0.0.1
.venv/bin/python -m uvicorn api.index:app --reload --host 127.0.0.1 --port 8020
```

Open `http://localhost:3000` in Windows.

## GitHub Pages (Frontend)

This repo includes a GitHub Actions workflow that exports the Next.js frontend and deploys it to GitHub Pages on every push to `main`.

Setup:
- Enable Pages: repo Settings → Pages → Source: GitHub Actions.

Frontend env vars (GitHub → Settings → Secrets and variables → Actions → Variables):
- `NEXT_PUBLIC_API_URL` (required for production) — URL вашего API, например `https://api.example.com/api`
- `NEXT_PUBLIC_BASE_PATH` (optional) — базовый путь для Pages (по умолчанию `/<repo>`)
- `NEXT_PUBLIC_POSTHOG_KEY` (optional) — ключ PostHog для аналитики

### Running in Production

For production deployments:

```bash
# Build the frontend
npm run build

# Start the frontend
npm run start

# Run the API separately
uvicorn api.index:app --host 0.0.0.0 --port 8000
```

Or use the included `Procfile` for platforms like Railway or Heroku.

## Docker (Backend)

Build the image:

```bash
docker build -t screen-vision-backend .
```

Run:

```bash
docker run --rm -p 8000:8000 \
  -e OPENAI_API_KEY=sk-... \
  -e DEEPINFRA_KEY=... \
  screen-vision-backend
```

Required env vars (backend):
- `OPENAI_API_KEY`
- `DEEPINFRA_KEY`

Optional:
- `GEMINI_API_KEY` (enables Gemini in `/api/check`)
- `DEEPINFRA_CHECK_MODEL`
- `DEEPINFRA_COORDINATES_MODEL`
