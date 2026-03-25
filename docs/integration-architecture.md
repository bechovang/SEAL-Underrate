# Integration Architecture

## Overview

The SEAL Underrate application consists of two distinct parts that communicate via REST API. This document describes how the frontend and backend integrate, along with external service integrations.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│                    (http://localhost:3000)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  - React Components                                          │
│  - API Client (lib/api/analysis.ts)                         │
│  - Polling Hook (hooks/use-analysis.ts)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API Calls
                         │ /api/v1/*
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  - API Endpoints (app/api/endpoints.py)                     │
│  - Background Tasks                                         │
│  - Business Logic (app/services/)                           │
└─────┬───────────────┬───────────────┬──────────────────────┘
      │               │               │
      │               │               │
┌─────▼─────┐  ┌─────▼──────┐  ┌────▼─────────────┐
│ PostgreSQL │  │ OpenRouter │  │ Target Websites  │
│   Database │  │    API     │  │  (Playwright)    │
└───────────┘  └────────────┘  └──────────────────┘
```

## Frontend → Backend Integration

### API Communication

**Development Base URL:** `http://localhost:8000/api/v1`
**Production Base URL:** `https://backend-api-production-9cf5.up.railway.app/api/v1`

**Client Location:** `fontend/lib/api/analysis.ts`
**API Configuration:** `fontend/lib/constants/api.ts`

**Production API URL Switching:**

The frontend automatically switches between development and production API URLs:

```typescript
// fontend/lib/constants/api.ts
const PRODUCTION_API_URL = 'https://backend-api-production-9cf5.up.railway.app/api/v1';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? ''  // Use Next.js proxy in development
    : PRODUCTION_API_URL);  // Use direct API calls in production
```

### Communication Flow

#### 1. Start Analysis

```
Frontend                          Backend
   │                                │
   │ POST /api/v1/analyze           │
   │ { url: "https://example.com" } │
   ├───────────────────────────────>│
   │                                │
   │   1. Create Job (PENDING)      │
   │   2. Queue background task     │
   │                                │
   │ { job_id: "uuid" }             │
   │<───────────────────────────────┤
   │                                │
   │   Start polling (5s interval)  │
   │                                │
```

#### 2. Poll Status

```
Frontend                          Backend
   │                                │
   │ GET /api/v1/status/X           │
   ├───────────────────────────────>│
   │                                │
   │ { status: "PROCESSING" }       │
   │<───────────────────────────────┤
   │                                │
   │ [Wait 5 seconds]               │
   │                                │
   │ GET /api/v1/status/X           │
   ├───────────────────────────────>│
   │                                │
   │ { status: "COMPLETED",         │
   │   result: {...} }              │
   │<───────────────────────────────┤
   │                                │
   │   Stop polling                 │
   │   Display results              │
```

**Note:** Status endpoint uses path parameter (`/status/{job_id}`) not query parameter.

#### 3. Fetch Screenshot

```
Frontend                          Backend
   │                                │
   │ GET /api/v1/screenshot/X/mobile │
   ├───────────────────────────────>│
   │                                │
   │ <image/png> binary data        │
   │<───────────────────────────────┤
   │                                │
   │   Display in UI                │
```

### Frontend API Client

**File:** `fontend/lib/api/analysis.ts`

```typescript
export async function startAnalysis(url: string): Promise<string> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to start analysis");
  }

  const data: AnalysisResponse = await response.json();
  return data.job_id;
}
```

**Note:** The API calls use relative paths (`/api/...`) which are proxied to the backend during development.

### Development Proxy

**Next.js Configuration:** `fontend/next.config.mjs`

```javascript
const nextConfig = {
  // API calls to /api/* are proxied to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  }
}
```

This allows the frontend to call `/api/analyze` and have it proxied to `http://localhost:8000/api/analyze`.

## Backend → External Services Integration

### OpenRouter API Integration

**Service:** `app/services/ai_agents.py`

**Purpose:** Access Claude 3.5 Sonnet for AI-powered analysis

**Configuration:**
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
CODE_ANALYST_MODEL=anthropic/claude-3.5-sonnet
VISION_ANALYST_MODEL=anthropic/claude-3.5-sonnet
SYNTHESIZER_MODEL=anthropic/claude-3.5-sonnet
```

**API Calls:**
1. **Code Analyst** - POST `/chat/completions` with Lighthouse data
2. **Vision Analyst** - POST `/chat/completions` with base64 images
3. **Report Synthesizer** - POST `/chat/completions` with combined analysis

**Request Format:**
```python
payload = {
    "model": settings.CODE_ANALYST_MODEL,
    "messages": [
        {"role": "system", "content": "Return ONLY valid JSON."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.0,
    "max_tokens": 20000,
}
```

**Error Handling:**
- Timeout: 120-180 seconds per request
- JSON parsing with multiple fallback strategies
- ValueError raised on non-JSON responses

### Playwright Integration

**Service:** `app/services/data_collector.py`

**Purpose:** Headless browser automation for screenshot/data capture

**Setup:**
```bash
playwright install chromium
```

**Flow:**
```
1. Launch Chromium (headless)
2. Navigate to target URL
3. Wait for network idle
4. Run Lighthouse (in-browser script)
5. Capture screenshots (3 viewports)
6. Extract HTML content
7. Close browser
```

**Screenshot Viewports:**
| Device | Width | Height |
|--------|-------|--------|
| Desktop | 1920 | 1080 |
| Tablet | 768 | 1024 |
| Mobile | 375 | 667 |

**Image Optimization:**
- Max dimension: 512px
- Format: PNG with optimization
- Storage: `/tmp/uiux_analyzer/{job_id}/`

### PostgreSQL Integration

**Service:** `app/database.py`

**ORM:** SQLAlchemy 2.0 with async-compatible session management

**Connection:**
```python
DATABASE_URL = "postgresql://postgres:password@localhost/ui_analyzer_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

**Dependency Injection:**
```python
@app.get("/status/{job_id}")
def get_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    # ...
```

**Session Lifecycle:**
- Created per request via `get_db()`
- Automatically closed after request
- Thread-safe for concurrent requests

## Data Flow Diagram

### Complete Analysis Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter URL, click Analyze
     ▼
┌──────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                       │
│  ┌────────────┐                                               │
│  │ useAnalysis │  ──► POST /api/analyze                      │
│  │    Hook     │                                               │
│  └────────────┘                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                        │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │   Endpoint   │ ──►│ Background   │ ──►│   Analyzer     │  │
│  │  (analyze)   │    │    Task      │    │  Service       │  │
│  └──────────────┘    └──────────────┘    └───────┬────────┘  │
└───────────────────────────────────────────────┼─────────────┘
                                                 │
                ┌────────────────────────────────┼─────────────────────────┐
                │                                │                         │
                ▼                                ▼                         ▼
    ┌───────────────────┐           ┌──────────────────┐      ┌──────────────────┐
    │  DataCollector    │           │   AIAgentService │      │   PostgreSQL      │
    │  (Playwright)     │           │  (OpenRouter)    │      │   Database        │
    └───────┬───────────┘           └──────┬───────────┘      └──────────────────┘
            │                              │
            │ Screenshots + Metrics       │ AI Analysis
            │                              │
            └──────────────┬───────────────┘
                           ▼
                  ┌─────────────────┐
                  │   Synthesize    │
                  │   Final Report  │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │  Store Results  │◄───── PostgreSQL
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Update Job      │
                  │ (COMPLETED)     │
                  └─────────────────┘
```

## Frontend Polling Logic

**File:** `fontend/hooks/use-analysis.ts`

```typescript
const setupPolling = (jobId: string) => {
  // Poll immediately
  pollStatus(jobId);

  // Then poll every 5 seconds
  pollingIntervalRef.current = setInterval(() => {
    pollStatus(jobId);
  }, 5000);
};

const pollStatus = async (jobId: string) => {
  // Use path parameter: /status/{job_id}
  const response = await fetch(`/api/status/${jobId}`);
  const data = await response.json();

  if (data.status === "completed" || data.status === "failed") {
    setResults(data);
    setIsLoading(false);
    stopPolling(); // Clear interval
  }
};
```

**Polling Behavior:**
- Starts immediately after job submission
- Polls every 5 seconds
- Stops on completion or failure
- Cleans up interval on component unmount

## Integration Points Summary

| From | To | Protocol | Purpose |
|------|-----|----------|---------|
| Frontend | Backend | REST (HTTP) | Submit analysis, poll status |
| Frontend | Backend | REST (HTTP) | Fetch screenshots |
| Backend | PostgreSQL | SQLAlchemy ORM | Persist jobs/results |
| Backend | OpenRouter | HTTPS (aiohttp) | AI analysis requests |
| Backend | Target Sites | Playwright | Screenshot/data collection |

## Error Handling Across Boundaries

### Frontend → Backend Errors

| Error | Handling |
|-------|----------|
| Network failure | `try/catch` in API client |
| Invalid URL | Validation before request |
| Job not found | Return `NOT_FOUND` status |
| Analysis failed | Display `error_message` |

### Backend → External Service Errors

| Service | Error Handling |
|---------|---------------|
| OpenRouter | Timeout → raise ValueError |
| Playwright | Navigation timeout → raise RuntimeError |
| PostgreSQL | Connection errors → propagate to API |

## Future Integration Enhancements

### Planned Improvements

1. **WebSocket/SSE** - Replace polling with real-time updates
2. **CDN** - Serve screenshots via CDN instead of backend
3. **Queue System** - Celery + Redis for reliable background jobs
4. **API Gateway** - Kong/AWS API Gateway for rate limiting
5. **Monitoring** - OpenTelemetry for distributed tracing
