# SEAL Underrate - Documentation Index

## Project Overview

- **Name:** SEAL Underrate - AI UI/UX Analyzer
- **Type:** Multi-part Web Application (2 parts)
- **Primary Language:** TypeScript (Frontend), Python (Backend)
- **Architecture:** Client-Server with REST API
- **Hackathon:** SEAL Hackathon 2025 - Top 3 Finalist

## Quick Reference

### Project Structure

| Part | Type | Tech Stack | Root Directory |
|------|------|------------|----------------|
| Frontend | Web Application | Next.js 16.0 + React 19 + TypeScript | `fontend/` |
| Backend | API Service | FastAPI + Python 3.11+ + PostgreSQL | `backend/` |

### Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend Framework** | Next.js | 16.0 (Turbopack) |
| **UI Library** | React | 19.2 |
| **Language** | TypeScript | 5.7+ |
| **Styling** | Tailwind CSS | 4.1+ |
| **Component Library** | Radix UI (shadcn/ui) | Latest |
| **Charts** | Recharts | 2.15+ |
| **Forms** | React Hook Form | 7.60+ |
| **Backend Framework** | FastAPI | 0.115+ |
| **Database** | PostgreSQL | 15+ |
| **ORM** | SQLAlchemy | 2.0+ |
| **Migrations** | Alembic | 1.13+ |
| **Browser Automation** | Playwright | 1.49+ |
| **AI Provider** | OpenRouter (Claude 3.5 Sonnet) | - |
| **HTTP Client** | aiohttp | 3.11+ |
| **Frontend Hosting** | Vercel | - |
| **Backend Hosting** | Railway | - |

### Entry Points

| Service | Entry Point | Port |
|---------|-------------|------|
| **Frontend** | `fontend/app/page.tsx` | 3000 |
| **Backend** | `backend/app/main.py` | 8000 |

### Architecture Patterns

- **Frontend:** Component-based with Server/Client Components, App Router
- **Backend:** Layered architecture (API → Services → Models → Database)
- **Async Processing:** FastAPI BackgroundTasks for long-running analysis

## Documentation

### Core Documentation

- [Project Overview](./project-overview.md) - Executive summary, tech stack, getting started
- [Source Tree Analysis](./source-tree-analysis.md) - Complete directory structure with explanations

### Architecture Documentation

- [Frontend Architecture](./architecture-frontend.md) - Next.js app structure, components, state management
- [Backend Architecture](./architecture-backend.md) - FastAPI structure, services, async processing
- [Integration Architecture](./integration-architecture.md) - Frontend-Backend communication, external services

### API & Data

- [API Contracts](./api-contracts.md) - REST API endpoints, request/response schemas
- [Data Models](./data-models.md) - Database schema, ORM models, migrations

### Development

- [Development Guide](./development-guide.md) - Setup instructions, common tasks, troubleshooting

### External Documentation

- [README.md](../README.md) - Comprehensive project documentation with features and installation

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- OpenRouter API key ([Get here](https://openrouter.ai/keys))

### Quick Start

```bash
# 1. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium

# Create .env file
cp env.example .env
# Edit .env with your DATABASE_URL and OPENROUTER_API_KEY

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Frontend Setup (new terminal)
cd fontend
npm install
npm run dev
```

### Access Points

**Local Development:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

**Production:**
- **Frontend:** https://seal-underrate.vercel.app
- **Backend API:** https://backend-api-production-9cf5.up.railway.app

## API Endpoints

| Method | Path | Purpose | Response |
|--------|------|---------|----------|
| POST | `/api/v1/analyze` | Submit URL for analysis | `{"job_id": "uuid"}` |
| GET | `/api/v1/status/{job_id}` | Get analysis status/results | Full result or status |
| GET | `/api/v1/screenshot/{job_id}/{device}` | Get screenshot image | PNG file |

## Key Features

1. **AI-Powered Analysis** - Uses Claude 3.5 Sonnet via OpenRouter for intelligent insights
2. **Multi-Device Screenshots** - Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
3. **Performance Metrics** - Core Web Vitals via Lighthouse
4. **Accessibility Audit** - WCAG compliance checks
5. **Real-time Updates** - Polling-based status tracking (5-second intervals)
6. **Responsive Design** - Works on all device sizes

## Analysis Workflow

```
1. User submits URL
   ↓
2. Frontend calls POST /api/v1/analyze
   ↓
3. Backend creates job, returns job_id
   ↓
4. Background task starts:
   - Playwright captures screenshots (3 devices)
   - Runs Lighthouse audit
   - Calls AI for code analysis
   - Calls AI for vision analysis
   - Synthesizes results
   ↓
5. Frontend polls GET /api/v1/status/{job_id}
   ↓
6. Results displayed when status = COMPLETED
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Verify OpenRouter API key in `backend/.env` |
| Port already in use | Kill process on port 8000/3000 |
| Screenshots not showing | Check Playwright installation: `playwright install chromium` |
| Database connection error | Ensure PostgreSQL is running and database exists |

See [README.md](../README.md) for detailed troubleshooting guide.

## Project Status

**Phase:** 3 (Complete) - MVP with AI analysis working
**Hackathon Result:** Top 3 Finalist at SEAL Hackathon 2025

## Architecture Highlights

### Backend Architecture

```
app/
├── main.py              # FastAPI app, CORS, routes
├── database.py          # PostgreSQL connection
├── api/
│   └── endpoints.py     # /analyze, /status, /screenshot endpoints
├── models/
│   └── job.py           # Job ORM model
├── services/
│   ├── analyzer.py      # Analysis orchestration
│   ├── ai_agents.py     # OpenRouter API calls
│   └── data_collector.py # Playwright automation
└── utils/
    └── config.py        # Settings with pydantic
```

### Frontend Architecture

```
app/
├── page.tsx             # Main page with URL input
├── layout.tsx           # Root layout with theme
├── api/                 # Next.js API routes (proxy to backend)
│   ├── analyze/
│   ├── status/
│   └── screenshot/
├── components/
│   ├── analysis/
│   │   ├── results.tsx  # Main results display
│   │   └── ...
│   └── ui/              # shadcn/ui components
├── hooks/
│   └── use-analysis.ts  # Analysis state & polling
├── lib/
│   └── api/
│       └── analysis.ts  # API client functions
└── types/
    └── analysis.ts      # TypeScript types
```

## Documentation Metadata

- **Generated:** 2026-03-25
- **Last Updated:** 2026-03-25
- **Project Version:** 1.0.0
- **Documentation Version:** 2.0.0
- **Total Documents:** 10 documents
