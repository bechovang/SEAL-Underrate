# SEAL Underrate - Project Overview

## Executive Summary

**SEAL Underrate** is an AI-powered web application that analyzes websites to provide comprehensive UI/UX analysis, performance metrics, accessibility audits, and actionable improvement recommendations.

**Project Type:** Multi-part Web Application
**Repository Structure:** Monorepo with separate Frontend and Backend
**Primary Language:** TypeScript (Frontend), Python (Backend)
**Architecture Pattern:** Client-Server with REST API

## Project Purpose

The application enables users to:
- Submit any website URL for analysis
- Receive automated AI-generated reports on performance, accessibility, and design
- View multi-device screenshots (desktop, tablet, mobile)
- Get prioritized action items for improvements

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Frontend Framework** | Next.js 15.1 + React 19 |
| **Backend Framework** | FastAPI (Python) |
| **Database** | PostgreSQL 15 |
| **AI Provider** | OpenRouter (Claude 3.5 Sonnet) |
| **Browser Automation** | Playwright |
| **Entry Points** | `fontend/app/page.tsx`, `backend/app/main.py` |
| **Architecture Pattern** | Layered (API → Service → Data) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Railway |

## Repository Structure

```
SEAL-Underrate/
├── fontend/              # Next.js web application (Part: frontend)
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components (UI + feature)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API clients
│   └── public/          # Static assets
├── backend/             # FastAPI REST API (Part: backend)
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── models/     # SQLAlchemy ORM models
│   │   ├── services/   # Business logic
│   │   ├── utils/      # Configuration and utilities
│   │   └── main.py     # FastAPI app entry point
│   ├── alembic/        # Database migrations
│   └── venv/           # Python virtual environment
├── docs/               # Generated documentation
├── README.md           # Comprehensive project documentation
└── _bmad/              # BMad framework configuration
```

## Technology Stack Summary

### Frontend (Web Application)
- **Framework**: Next.js 15.1 with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Component Library**: Radix UI (accessible primitives)
- **Charts**: Recharts
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Deployment**: Vercel

### Backend (API Service)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: SQLAlchemy create_all (startup)
- **Browser Automation**: Playwright (headless Chromium)
- **AI Integration**: OpenRouter API (Claude 3.5 Sonnet)
- **Async Runtime**: asyncio + aiohttp
- **Deployment**: Railway with Dockerfile

## Architecture Classification

### Frontend Architecture
- **Pattern**: Component-based with Server/Client Components
- **State Management**: Local component state + custom hooks
- **Routing**: Next.js App Router (file-based)
- **Data Fetching**: REST API with polling for async jobs

### Backend Architecture
- **Pattern**: Layered architecture (Endpoints → Services → Models)
- **API Style**: REST with background task processing
- **Database**: Relational with ORM (SQLAlchemy)
- **Async Processing**: Background tasks with job queue pattern

## Integration Points

| From | To | Type | Description |
|------|-----|------|-------------|
| Frontend | Backend | REST API | HTTP calls to `/api/v1/*` endpoints |
| Frontend | Backend | Polling | Status checks on analysis jobs |
| Backend | PostgreSQL | ORM | SQLAlchemy for data persistence |
| Backend | OpenRouter | HTTP | AI API calls for analysis |
| Backend | Target Websites | Playwright | Browser automation for data collection |

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
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Documentation Index

- [Frontend Architecture](./architecture-frontend.md)
- [Backend Architecture](./architecture-backend.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Integration Architecture](./integration-architecture.md)
- [Development Guide](./development-guide.md)

## Key Features

1. **AI-Powered Analysis**: Uses Claude 3.5 Sonnet via OpenRouter for intelligent insights
2. **Multi-Device Screenshots**: Captures desktop, tablet, and mobile views
3. **Performance Metrics**: Core Web Vitals (FCP, LCP, CLS) via Lighthouse
4. **Accessibility Audit**: WCAG compliance checks
5. **Real-time Updates**: Polling-based status tracking
6. **Responsive Design**: Works on all device sizes

## Development Status

**Phase**: 3 (Complete) - Based on README
- ✅ Frontend UI/UX analysis display
- ✅ Backend API with async processing
- ✅ AI integration for analysis
- ✅ Database models and migrations
- ✅ Screenshot capture and optimization
