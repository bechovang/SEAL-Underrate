# Development Guide

## Overview

This guide provides instructions for setting up and developing the SEAL Underrate project locally.

## Prerequisites

### System Requirements

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Python | 3.11+ | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| PostgreSQL | 15+ | Database |
| Git | Latest | Version control |

### External Services

| Service | Purpose | Setup |
|---------|---------|-------|
| OpenRouter API | AI analysis | Get API key from https://openrouter.ai/keys |

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/bechovang/SEAL-Underrate.git
cd SEAL-Underrate
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
```

**Environment Configuration:**

```bash
# Copy environment template
cp env.example .env

# Edit .env with your values
```

**Required `.env` variables:**
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost/ui_analyzer_db

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# AI Models (optional - defaults shown)
CODE_ANALYST_MODEL=anthropic/claude-3.5-sonnet
VISION_ANALYST_MODEL=anthropic/claude-3.5-sonnet
SYNTHESIZER_MODEL=anthropic/claude-3.5-sonnet
```

**Database Setup:**

```bash
# Create PostgreSQL database
createdb ui_analyzer_db

# Or create via psql
psql -U postgres
CREATE DATABASE ui_analyzer_db;
\q

# Run migrations
alembic upgrade head
```

**Start Backend Server:**

```bash
# Development mode (auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Verify Backend:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd fontend

# Install dependencies
npm install
# or
pnpm install
```

**Start Frontend Server:**

```bash
# Development mode
npm run dev
# or
pnpm dev

# Production build
npm run build
npm start
```

**Verify Frontend:**
- App: http://localhost:3000

## Development Workflow

### Backend Development

**Running Tests:**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run tests (if pytest is configured)
pytest

# Run with coverage
pytest --cov=app
```

**Code Formatting:**

```bash
# Format code with Black
black .

# Sort imports with isort
isort .

# Type checking with mypy
mypy .
```

**Database Migrations:**

```bash
# Create new migration
alembic revision -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View current version
alembic current

# View migration history
alembic history
```

**Database Management:**

```bash
# Access database via psql
psql -U postgres -d ui_analyzer_db

# Common queries
\dt                    # List tables
SELECT * FROM jobs;    # View jobs
```

### Frontend Development

**Running Tests:**

```bash
cd fontend

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Linting:**

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

**Type Checking:**

```bash
# TypeScript compiler check
npx tsc --noEmit
```

## Project Structure Reference

### Backend File Locations

| File/Directory | Purpose |
|----------------|---------|
| `backend/app/main.py` | FastAPI app entry point |
| `backend/app/api/endpoints.py` | REST API definitions |
| `backend/app/services/analyzer.py` | Analysis orchestration |
| `backend/app/services/ai_agents.py` | OpenRouter integration |
| `backend/app/services/data_collector.py` | Playwright automation |
| `backend/app/models/job.py` | SQLAlchemy Job model |
| `backend/app/database.py` | DB connection management |
| `backend/app/schemas.py` | Pydantic models |
| `backend/alembic/versions/` | Database migrations |
| `backend/requirements.txt` | Python dependencies |
| `backend/.env` | Environment variables |

### Frontend File Locations

| File/Directory | Purpose |
|----------------|---------|
| `fontend/app/page.tsx` | Main page component |
| `fontend/components/analysis/` | Analysis feature components |
| `fontend/components/ui/` | Radix UI components |
| `fontend/hooks/use-analysis.ts` | Analysis state hook |
| `fontend/lib/api/analysis.ts` | API client functions |
| `fontend/package.json` | NPM dependencies |
| `fontend/next.config.mjs` | Next.js configuration |
| `fontend/tsconfig.json` | TypeScript configuration |

## Common Development Tasks

### Adding a New API Endpoint

**Backend:**

1. Define route in `backend/app/api/endpoints.py`:
```python
@router.get("/new-endpoint")
def new_endpoint(db: Session = Depends(get_db)):
    # Your logic here
    return {"data": "response"}
```

2. Add Pydantic schema in `backend/app/schemas.py` (if needed)

**Frontend:**

1. Add API client function in `fontend/lib/api/analysis.ts`:
```typescript
export async function newEndpoint() {
  const response = await fetch("/api/new-endpoint");
  return await response.json();
}
```

### Adding a New UI Component

**Using shadcn/ui:**

```bash
cd fontend
npx shadcn-ui@latest add [component-name]
```

**Manual:**

1. Create component in `fontend/components/ui/`
2. Follow existing patterns (e.g., `button.tsx`)
3. Export from `index.ts` if needed

### Database Schema Changes

1. Create migration:
```bash
alembic revision -m "description of changes"
```

2. Edit migration file in `alembic/versions/`

3. Apply migration:
```bash
alembic upgrade head
```

### Modifying AI Prompts

Edit prompts in `backend/app/services/ai_agents.py`:

- `run_code_analyst()` - Code/HTML analysis prompt
- `run_vision_analyst()` - UI/UX analysis prompt
- `run_report_synthesizer()` - Summary generation prompt

## Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Check PostgreSQL is running
pg_ctl status

# Verify database exists
psql -l | grep ui_analyzer_db

# Check DATABASE_URL in .env
cat backend/.env | grep DATABASE_URL
```

**Playwright browser not found:**
```bash
cd backend
playwright install chromium
```

**Import errors:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Integration Issues

**Frontend can't reach backend:**
1. Ensure backend is running on port 8000
2. Check Next.js proxy configuration in `next.config.mjs`
3. Verify API calls use relative paths (`/api/...`)

**CORS errors:**
- Currently using Next.js proxy (no CORS needed in dev)
- For production, configure CORS in FastAPI

## Debugging

### Backend Debugging

**Print statements:**
```python
print(f"Debug: {variable}")
```

**Logging:**
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Info message")
logger.error("Error message")
```

**Python Debugger:**
```bash
# Run with debugger
python -m pdb app/main.py
```

### Frontend Debugging

**Browser DevTools:**
- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+I

**React DevTools:**
- Install browser extension
- Components and Profiler tabs

**Console logging:**
```typescript
console.log("Debug:", variable);
console.error("Error:", error);
```

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | None | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | Yes | None | OpenRouter API key |
| `OPENROUTER_BASE_URL` | No | https://openrouter.ai/api/v1 | OpenRouter API URL |
| `CODE_ANALYST_MODEL` | No | anthropic/claude-3.5-sonnet | Model for code analysis |
| `VISION_ANALYST_MODEL` | No | anthropic/claude-3.5-sonnet | Model for vision analysis |
| `SYNTHESIZER_MODEL` | No | anthropic/claude-3.5-sonnet | Model for report synthesis |

### Frontend

Currently no environment variables required. Uses Next.js proxy for API calls.

## Production Considerations

### Backend

- Use production WSGI server (Gunicorn)
- Configure proper logging
- Set up monitoring (Prometheus/Grafana)
- Use environment variables for secrets
- Enable HTTPS/TLS
- Configure CORS properly

### Frontend

- Build with `npm run build`
- Serve with Node.js or CDN
- Enable compression
- Configure caching headers
- Use environment variables for API URL
- Enable analytics

### Database

- Regular backups
- Connection pooling
- Index optimization
- Query performance monitoring
- Regular migrations

## Production Deployment

### Overview

The SEAL Underrate application uses a split deployment architecture:
- **Frontend**: Vercel (Next.js optimized hosting)
- **Backend**: Railway (Python services with PostgreSQL)

### Live URLs

- **Frontend**: https://seal-underrate.vercel.app
- **Backend**: https://backend-api-production-9cf5.up.railway.app

### Frontend Deployment (Vercel)

**Configuration File:** `fontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs"
}
```

**Key Features:**
- Uses `--legacy-peer-deps` to handle Radix UI peer dependency warnings
- Automatic builds on git push to main branch
- Preview deployments for pull requests

**Deploy via Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or link existing project
cd fontend
vercel link
vercel --prod
```

**Environment Variables (Vercel):**

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | https://backend-api-production-9cf5.up.railway.app/api/v1 | Production backend URL (optional) |

### Backend Deployment (Railway)

**Configuration File:** `backend/railway.toml`

```toml
[build]
builder = "DOCKERFILE"

[deploy]
healthcheckPath = "/"

[env]
PORT = "8000"
```

**Dockerfile:** `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers with system dependencies
RUN playwright install --with-deps chromium

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Key Features:**
- Uses Dockerfile builder for reliable Playwright browser installation
- Installs Chromium with system dependencies during build
- Includes CORS middleware for cross-origin requests
- Auto-creates database tables on startup

**Deploy via Railway CLI:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project or link existing
railway link

# Set environment variables
railway variables set OPENROUTER_API_KEY=sk-or-v1-your-key

# Deploy
railway up

# Or deploy from specific directory
railway up --backend
```

**Railway Services:**

| Service | Type | Purpose |
|---------|------|---------|
| Backend API | Dockerfile | FastAPI application |
| PostgreSQL | Plugin | Database storage |

**Environment Variables (Railway):**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Auto | Railway provides | PostgreSQL connection |
| `OPENROUTER_API_KEY` | Yes | None | OpenRouter API key |
| `PORT` | No | 8000 | Application port |

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│                    https://seal-underrate.vercel.app       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Vercel Edge Network                     │
│  - Next.js 15.1 Application                                  │
│  - Static Assets (.next/static)                             │
│  - API Routes (app/api/*)                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API (HTTPS)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Railway Infrastructure                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              FastAPI Backend (Docker)               │    │
│  │  - Playwright Chromium (installed via Dockerfile)  │    │
│  │  - OpenRouter API Integration                      │    │
│  │  - CORS Middleware                                 │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │ SQLAlchemy ORM                       │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │           PostgreSQL Database (Railway)             │    │
│  │  - Jobs table (auto-created on startup)            │    │
│  │  - Analysis results storage                        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Troubleshooting

**Issue: Playwright browsers not installed**

Error: `Executable doesn't exist at /root/.cache/ms-playwright/...`

Solution: Ensure Railway uses Dockerfile builder (not NIXPACKS) and includes:
```dockerfile
RUN playwright install --with-deps chromium
```

**Issue: CORS errors in production**

Error: `Access blocked by CORS policy`

Solution: Verify backend includes CORS middleware:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Issue: Database table not found**

Error: `relation "jobs" does not exist`

Solution: Tables are created on startup via SQLAlchemy:
```python
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
```

**Issue: Frontend can't reach backend in production**

Check:
1. `NEXT_PUBLIC_API_URL` environment variable in Vercel
2. Backend is deployed and accessible
3. CORS is properly configured on backend

### CI/CD Integration

**GitHub Actions (Optional):**

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./fontend

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/cli-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend-api-production
```

## Additional Resources

### Documentation

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Playwright Docs](https://playwright.dev/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Alembic Docs](https://alembic.sqlalchemy.org/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community

- FastAPI Discord
- Next.js GitHub Discussions
- Stack Overflow tags: #fastapi, #nextjs, #playwright
