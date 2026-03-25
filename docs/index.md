# SEAL Underrate - Documentation Index

## Project Overview

- **Type:** Multi-part Web Application (2 parts)
- **Primary Language:** TypeScript (Frontend), Python (Backend)
- **Architecture:** Client-Server with REST API

## Quick Reference

### Project Structure

| Part | Type | Tech Stack | Root |
|------|------|------------|------|
| Frontend | Web Application | Next.js 15.1 + React 19 + TypeScript | `fontend/` |
| Backend | API Service | FastAPI + Python + PostgreSQL | `backend/` |

### Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | Next.js 15.1 with App Router |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Component Library** | Radix UI (shadcn/ui) |
| **Backend Framework** | FastAPI |
| **Database** | PostgreSQL 15 |
| **ORM** | SQLAlchemy 2.0 |
| **Browser Automation** | Playwright |
| **AI Provider** | OpenRouter (Claude 3.5 Sonnet) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Railway |

### Entry Points

- **Frontend:** `fontend/app/page.tsx`
- **Backend:** `backend/app/main.py`

### Architecture Patterns

- **Frontend:** Component-based with Server/Client Components
- **Backend:** Layered architecture (API → Services → Models)

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

### Existing Documentation

- [README.md](../README.md) - Comprehensive project documentation with features and installation

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- OpenRouter API key

### Quick Start

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd fontend
npm install
npm run dev
```

### Access Points

**Local Development:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

**Production:**
- **Frontend:** https://seal-underrate.vercel.app
- **Backend API:** https://backend-api-production-9cf5.up.railway.app

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/analyze` | Submit URL for analysis |
| GET | `/api/v1/status/{job_id}` | Get analysis status/results |
| GET | `/api/v1/screenshot/{job_id}/{device}` | Get screenshot image |

## Key Features

1. **AI-Powered Analysis** - Uses Claude 3.5 Sonnet for intelligent insights
2. **Multi-Device Screenshots** - Desktop, tablet, and mobile views
3. **Performance Metrics** - Core Web Vitals via Lighthouse
4. **Accessibility Audit** - WCAG compliance checks
5. **Real-time Updates** - Polling-based status tracking
6. **Responsive Design** - Works on all device sizes

## Project Status

**Phase:** 3 (Complete)

## Documentation Metadata

- **Generated:** 2026-03-24
- **Scan Level:** Deep
- **Workflow Version:** 1.2.0
- **Total Files:** 10 documents
