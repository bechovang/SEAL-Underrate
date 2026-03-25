# Data Models

## Database Schema

### Database: PostgreSQL
- **Name:** `ui_analyzer_db` (configurable via `DATABASE_URL`)
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic

---

## Tables

### jobs

Stores website analysis job records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique job identifier |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | Job status (PENDING, PROCESSING, COMPLETED, FAILED) |
| `target_url` | VARCHAR | NOT NULL | URL being analyzed |
| `result` | JSONB | NULLABLE | Analysis results (full JSON structure) |
| `error_message` | VARCHAR | NULLABLE | Error message if job failed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Job creation timestamp |
| `completed_at` | TIMESTAMP | NULLABLE | Job completion timestamp |

**Implementation:** `backend/app/models/job.py`

```python
class JobStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(SQLAlchemyEnum(JobStatus), default=JobStatus.PENDING, nullable=False)
    target_url = Column(String, nullable=False)
    result = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
```

---

## JSON Schema: `result` Column

The `result` column stores the complete analysis output as JSON:

```json
{
  "job_id": "uuid",
  "url": "https://example.com",
  "analyzed_at": "2025-11-02T05:44:54.212830",

  "summary": "Executive summary text...",

  "overall_score": 85,  // 0-100

  "performance": {
    "score": 92,  // 0-100
    "metrics": {
      "fcp": 1200,      // First Contentful Paint (ms)
      "lcp": 1800,      // Largest Contentful Paint (ms)
      "cls": 0.05,      // Cumulative Layout Shift
      "load_time": 2500 // Total load time (ms)
    }
  },

  "accessibility": {
    "score": 88  // 0-100
  },

  "design": {
    "score": 82,  // 0-100
    "responsive_quality": "good"  // excellent|good|fair|poor
  },

  "issues": {
    "code": [
      {
        "category": "performance|accessibility|seo|code-quality",
        "severity": "critical|high|medium|low",
        "title": "Issue title",
        "description": "Detailed description",
        "recommendation": "How to fix"
      }
    ],
    "ui": [
      {
        "device": "desktop|tablet|mobile",
        "category": "layout|typography|color|accessibility|spacing|imagery",
        "severity": "critical|high|medium|low",
        "title": "Issue title",
        "description": "Detailed description",
        "location": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 50
        },
        "recommendation": "How to fix"
      }
    ]
  },

  "priority_actions": [
    {
      "action": "Action description",
      "impact": "high|medium|low",
      "effort": "easy|medium|hard"
    }
  ],

  "screenshots": {
    "desktop": "/full/path/to/desktop.png",
    "tablet": "/full/path/to/tablet.png",
    "mobile": "/full/path/to/mobile.png"
  }
}
```

---

## Pydantic Schemas

### Request Models

**AnalyzeRequest** - `backend/app/schemas.py`
```python
class AnalyzeRequest(BaseModel):
    url: str
```

### Response Models

**AnalyzeResponse**
```python
class AnalyzeResponse(BaseModel):
    job_id: UUID4
```

**StatusResponse**
```python
class StatusResponse(BaseModel):
    job_id: UUID4
    status: str  # JobStatus enum value
    result: Optional[Any] = None
    error_message: Optional[str] = None
```

---

## Database Migrations

### Migration Files Location
```
backend/alembic/versions/
```

### Existing Migrations

**a2a791f91c40_create_jobs_table.py**
- Creates the `jobs` table
- Defines all columns and constraints
- Sets up the JobStatus enum

### Running Migrations

```bash
# Create new migration
alembic revision -m "description"

# Apply all migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View current version
alembic current
```

---

## Database Connection

**Configuration:** `backend/app/database.py`

```python
DATABASE_URL = os.getenv("DATABASE_URL",
    "postgresql://postgres:password@localhost/ui_analyzer_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for injecting database sessions into endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Environment Variable:** `backend/.env`
```
DATABASE_URL=postgresql://postgres:password@localhost/ui_analyzer_db
```

---

## Entity Relationships

Currently **no foreign key relationships** - the `jobs` table is standalone.

Future extensions may include:
- `users` table (for authentication)
- `job_history` table (for audit trail)
- `screenshots` table (for separate file storage)

---

## Indexes

Default indexes on:
- `jobs.id` (primary key, automatically indexed)

Recommended future indexes:
- `jobs.created_at` (for time-based queries)
- `jobs.status` (for filtering by status)

---

## Data Flow

```
1. POST /analyze
   → Create Job record (status: PENDING)
   → Return job_id

2. Background Task starts
   → Update status to PROCESSING
   → Run Playwright data collection
   → Call AI analysis (code + vision)
   → Synthesize final report
   → Update result JSON
   → Update status to COMPLETED (or FAILED on error)

3. GET /status/{job_id}
   → Query Job by id
   → Return current status and result (if any)
```

---

## Temporary Data

Screenshots are stored in the system temp directory:
```
/tmp/uiux_analyzer/{job_id}/
  ├── desktop.png
  ├── tablet.png
  └── mobile.png
```

**Note:** These files are served via `/screenshot/{job_id}/{device}` endpoint but are not cleaned up automatically. Consider implementing a cleanup task for production.
