# Backend Architecture

## Overview

The backend is a **FastAPI** application built with **Python 3.11+**, implementing a layered architecture with async processing for website analysis tasks.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | FastAPI 0.120 | Async web framework |
| **Language** | Python 3.11+ | Core runtime |
| **Database** | PostgreSQL 15 | Relational data storage |
| **ORM** | SQLAlchemy 2.0 | Database abstraction |
| **Migrations** | Alembic | Schema versioning |
| **Browser Automation** | Playwright 1.40 | Headless screenshot/data capture |
| **AI Integration** | OpenRouter API | Claude 3.5 Sonnet access |
| **HTTP Client** | aiohttp | Async HTTP requests |
| **Image Processing** | Pillow | Screenshot optimization |

## Architecture Pattern

### Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│                  API Layer (Endpoints)              │
│         FastAPI Router + Request Handlers           │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Service Layer (Business Logic)          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Analyzer   │  │ AI Agents  │  │ Data Collector│  │
│  │ Orchestrator│  │ Integration │  │ Playwright   │  │
│  └────────────┘  └────────────┘  └──────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                Data Layer (Models)                  │
│              SQLAlchemy ORM + Database              │
└─────────────────────────────────────────────────────┘
```

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # DB connection & session management
│   ├── schemas.py           # Pydantic request/response models
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py     # REST API endpoint definitions
│   ├── models/
│   │   ├── __init__.py
│   │   └── job.py           # SQLAlchemy Job model
│   ├── services/
│   │   ├── __init__.py
│   │   ├── analyzer.py      # Analysis workflow orchestration
│   │   ├── ai_agents.py     # OpenRouter/AI integration
│   │   └── data_collector.py # Playwright browser automation
│   └── utils/
│       └── config.py        # Environment configuration
├── alembic/
│   ├── env.py              # Alembic environment
│   └── versions/           # Database migrations
│       └── a2a791f91c40_create_jobs_table.py
├── alembic.ini             # Alembic configuration
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── env.example             # Environment template
```

## Request Flow

### Analysis Request Flow

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ 1. POST /analyze
       ├───────────────────────────────────────────┐
       │                                           │
┌──────▼──────────┐              ┌─────────────────▼────────┐
│  FastAPI App    │              │  Background Task Manager  │
│  (main.py)      │              │  (FastAPI BackgroundTasks)│
└──────┬──────────┘              └─────────────┬─────────────┘
       │                                       │
       │ 2. Create Job (PENDING)               │
       ├─────────────────────────────────────> │
       │                                       │
       │ 3. Add background task                │
       ├─────────────────────────────────────> │
       │                                       │
       │ 4. Return job_id                      │
       │<─────────────────────────────────────┤
       │                                       │
       │<─────────────────────────────────────┤
┌──────▼──────────┐                          │
│   Client        │                          │
└─────────────────┘                          │
                                             │
                          ┌──────────────────▼──────────────┐
                          │  run_analysis_task_bg()          │
                          │  (analyzer.py)                   │
                          └──────────────┬───────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
         ┌──────────▼──────────┐  ┌─────▼──────┐  ┌────────▼────────┐
         │  DataCollector      │  │ AI Agents  │  │ Database        │
         │  - Playwright       │  │ - OpenRouter│  │ - Update status │
         │  - Screenshots      │  │ - Code Analyst │  │ - Store results│
         │  - HTML/Lighthouse  │  │ - Vision Analyst│                │
         │  - Metrics          │  │ - Synthesizer│  │                │
         └─────────────────────┘  └────────────┘  └─────────────────┘
```

## Component Details

### API Layer (`api/endpoints.py`)

**Responsibilities:**
- HTTP request/response handling
- Input validation (via Pydantic)
- Job creation and triggering
- Status queries
- Screenshot serving

**Endpoints:**
| Method | Path | Handler | Purpose |
|--------|------|---------|---------|
| POST | `/analyze` | `analyze_url()` | Start analysis job |
| GET | `/status/{job_id}` | `get_status()` | Get job status/results |
| GET | `/screenshot/{job_id}/{device}` | `get_screenshot()` | Serve screenshot image |

**Code Example:**
```python
@router.post("/analyze", response_model=schemas.AnalyzeResponse, status_code=202)
def analyze_url(
    request: schemas.AnalyzeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    new_job = Job(target_url=request.url)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    background_tasks.add_task(run_analysis_task_bg, str(new_job.id), new_job.target_url)

    return {"job_id": new_job.id}
```

### Service Layer

#### Analyzer Service (`services/analyzer.py`)

**Purpose:** Orchestrates the complete analysis workflow

**Flow:**
1. Update job status to PROCESSING
2. Collect data via `DataCollector`
3. Run parallel AI analyses (code + vision)
4. Synthesize final report
5. Update job with results

**Key Function:**
```python
async def run_analysis_task(job_id: str, target_url: str) -> None:
    # 1. Update status
    job.status = JobStatus.PROCESSING

    # 2. Collect data
    collector = DataCollector(job_id)
    raw_data = await collector.collect_all_data(target_url)

    # 3. Run AI analyses in parallel
    ai_service = AIAgentService()
    code_task = ai_service.run_code_analyst(...)
    vision_task = ai_service.run_vision_analyst(...)
    code_analysis, vision_analysis = await asyncio.gather(code_task, vision_task)

    # 4. Synthesize report
    synthesis = await ai_service.run_report_synthesizer(...)

    # 5. Store results
    job.result = final_result
    job.status = JobStatus.COMPLETED
```

#### AI Agent Service (`services/ai_agents.py`)

**Purpose:** Integrates with OpenRouter API for AI-powered analysis

**Three AI Agents:**

1. **Code Analyst** - Analyzes technical metrics (Lighthouse, HTML)
   - Evaluates performance, accessibility, SEO
   - Identifies code-level issues
   - Returns structured JSON with scores and issues

2. **Vision Analyst** - Analyzes UI/UX from screenshots
   - Evaluates visual hierarchy, typography, color
   - Identifies UI issues with bounding box coordinates
   - Returns structured JSON with design scores and UI issues

3. **Report Synthesizer** - Combines analyses into executive summary
   - Creates concise executive summary
   - Prioritizes action items by impact/effort
   - Calculates overall score

**Implementation Details:**
- Uses `aiohttp` for async HTTP requests
- Implements robust JSON parsing with fallback strategies
- Handles base64-encoded images for vision analysis
- Uses Claude 3.5 Sonnet via OpenRouter

#### Data Collector Service (`services/data_collector.py`)

**Purpose:** Collects raw data from target websites using Playwright

**Data Collected:**
1. **Lighthouse Metrics** - Performance, accessibility scores
2. **Screenshots** - Desktop, tablet, mobile views
3. **HTML Content** - First 5000 characters for analysis

**Screenshot Process:**
```python
async def _capture_screenshots(self, page) -> Dict[str, str]:
    viewports = {
        'desktop': {'width': 1920, 'height': 1080},
        'tablet': {'width': 768, 'height': 1024},
        'mobile': {'width': 375, 'height': 667}
    }

    for device, viewport in viewports.items():
        await page.set_viewport_size(viewport)
        screenshot_bytes = await page.screenshot(full_page=False)

        # Resize to max 512px dimension for API limits
        img = Image.open(io.BytesIO(screenshot_bytes))
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        img.save(screenshot_path, 'PNG', optimize=True)
```

**Key Features:**
- Aggressive image resizing to stay under API limits
- PNG optimization for file size
- Temporary file storage in `/tmp/uiux_analyzer/{job_id}/`

### Data Layer

#### Database Connection (`database.py`)

**SQLAlchemy Configuration:**
```python
DATABASE_URL = os.getenv("DATABASE_URL",
    "postgresql://postgres:password@localhost/ui_analyzer_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency injection for FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### Job Model (`models/job.py`)

**SQLAlchemy Model:**
```python
class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(SQLAlchemyEnum(JobStatus), default=JobStatus.PENDING, nullable=False)
    target_url = Column(String, nullable=False)
    result = Column(JSON, nullable=True)  # Full analysis result
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
```

**Status Flow:**
```
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED
```

## Configuration

### Environment Variables (`.env`)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost/ui_analyzer_db

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# AI Models
CODE_ANALYST_MODEL=anthropic/claude-3.5-sonnet
VISION_ANALYST_MODEL=anthropic/claude-3.5-sonnet
SYNTHESIZER_MODEL=anthropic/claude-3.5-sonnet
```

### Configuration Loading (`utils/config.py`)

Uses `pydantic-settings` for type-safe configuration.

## Async Processing

### Background Tasks

FastAPI's `BackgroundTasks` is used for non-blocking job execution:

```python
@router.post("/analyze")
def analyze_url(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # ...
    background_tasks.add_task(run_analysis_task_bg, job_id, url)
    return {"job_id": job_id}
```

**Why Background Tasks?**
- Simple, built-in with FastAPI
- Suitable for I/O-bound tasks
- No external queue dependency (development-friendly)

**Production Consideration:**
- For production, consider Celery + Redis
- Better scalability and fault tolerance
- Job retry mechanisms

### Async/Await Pattern

All service methods use `async/await` for concurrency:

```python
async def run_analysis_task(job_id: str, target_url: str) -> None:
    # Parallel execution
    code_task = ai_service.run_code_analyst(...)
    vision_task = ai_service.run_vision_analyst(...)
    code_analysis, vision_analysis = await asyncio.gather(code_task, vision_task)
```

## Error Handling

### Job Failure Handling

```python
try:
    # Analysis logic
    job.status = JobStatus.COMPLETED
except Exception as e:
    job.status = JobStatus.FAILED
    job.error_message = str(e)
    job.completed_at = datetime.utcnow()
finally:
    db.commit()
    db.close()
```

### AI Response Parsing

Robust JSON parsing with multiple fallback strategies:
1. Direct JSON parse
2. Extract from ```json``` code blocks
3. Brace balancing for embedded JSON

## Performance Considerations

### Optimizations

1. **Parallel AI Calls:** Code and vision analysis run concurrently
2. **Screenshot Optimization:** Images resized to 512px max dimension
3. **PNG Compression:** Optimize flag enabled
4. **Connection Pooling:** SQLAlchemy engine manages connections

### Bottlenecks

1. **Playwright Launch:** Browser startup overhead (~1-2s)
2. **AI API Calls:** 120-180s timeout per analysis
3. **Lighthouse Execution:** ~5-10s per page

## Security Considerations

### Current State

- No authentication implemented (Phase 2)
- No rate limiting (Phase 2)
- Input validation via Pydantic
- CORS using FastAPI defaults

### Recommendations

1. **Authentication:** JWT or API keys
2. **Rate Limiting:** Per-IP or per-user
3. **Input Validation:** URL whitelist/blacklist
4. **Secrets Management:** Use vault/service for API keys
5. **CORS:** Configure for production domains

## Development Workflow

### Local Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
alembic upgrade head
uvicorn app.main:app --reload
```

**Development Server:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

### Database Migrations

```bash
# Create migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Future Enhancements

### Potential Improvements

1. **Queue System:** Celery + Redis for background jobs
2. **Caching:** Redis for completed analyses
3. **WebSocket:** Real-time status updates instead of polling
4. **File Storage:** S3 for screenshot storage
5. **Worker Pool:** Multiple Playwright instances
6. **Monitoring:** Prometheus + Grafana metrics
7. **Logging:** Structured logging with ELK stack
