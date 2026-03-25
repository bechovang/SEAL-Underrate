# API Contracts

## Base URL

```
http://localhost:8000/api/v1
```

## Overview

The SEAL Underrate API provides REST endpoints for website analysis. Analysis is performed asynchronously using background tasks, with job status polling for results.

---

## Endpoints

### 1. Submit Analysis Request

**Endpoint:** `POST /analyze`

**Description:** Submits a URL for analysis and creates a background job.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Implementation:** `backend/app/api/endpoints.py:analyze_url()`

**Flow:**
1. Creates new Job record in database with PENDING status
2. Adds background task to FastAPI BackgroundTasks
3. Returns job_id immediately for polling

---

### 2. Get Analysis Status

**Endpoint:** `GET /status/{job_id}`

**Description:** Retrieves the current status and results of an analysis job.

**Parameters:**
- `job_id` (path): UUID of the analysis job

**Response (200 OK):**

**Pending/Processing:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PROCESSING",
  "result": null,
  "error_message": null
}
```

**Completed:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED",
  "result": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://example.com",
    "analyzed_at": "2025-11-02T05:44:54.212830",
    "summary": "Executive summary...",
    "overall_score": 85,
    "performance": {
      "score": 92,
      "metrics": {
        "fcp": 1200,
        "lcp": 1800,
        "cls": 0.05,
        "load_time": 2500
      }
    },
    "accessibility": {
      "score": 88
    },
    "design": {
      "score": 82,
      "responsive_quality": "good"
    },
    "issues": {
      "code": [
        {
          "category": "performance",
          "severity": "high",
          "title": "Large image sizes",
          "description": "...",
          "recommendation": "..."
        }
      ],
      "ui": [
        {
          "device": "mobile",
          "category": "typography",
          "severity": "medium",
          "title": "Small font size",
          "description": "...",
          "location": {"x": 0, "y": 0, "width": 100, "height": 50},
          "recommendation": "..."
        }
      ]
    },
    "priority_actions": [
      {
        "action": "Optimize images",
        "impact": "high",
        "effort": "easy"
      }
    ],
    "screenshots": {
      "desktop": "/api/v1/screenshot/job_id/desktop",
      "tablet": "/api/v1/screenshot/job_id/tablet",
      "mobile": "/api/v1/screenshot/job_id/mobile"
    }
  },
  "error_message": null
}
```

**Failed:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "FAILED",
  "result": null,
  "error_message": "Timeout waiting for page load"
}
```

**Not Found:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "NOT_FOUND",
  "result": null,
  "error_message": null
}
```

**Implementation:** `backend/app/api/endpoints.py:get_status()`

---

### 3. Get Screenshot

**Endpoint:** `GET /screenshot/{job_id}/{device}`

**Description:** Retrieves the screenshot image for a completed analysis job.

**Parameters:**
- `job_id` (path): UUID of the analysis job
- `device` (path): One of `desktop`, `tablet`, `mobile`

**Response (200 OK):**
- **Content-Type:** `image/png`
- **Body:** Binary PNG image data

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid device type or job not completed |
| 404 | Job not found or screenshot file not found |

**Implementation:** `backend/app/api/endpoints.py:get_screenshot()`

---

## Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Job created, waiting to start |
| `PROCESSING` | Analysis in progress |
| `COMPLETED` | Analysis complete, results available |
| `FAILED` | Analysis failed, check error_message |
| `NOT_FOUND` | Job ID does not exist |

---

## Schema Definitions

### AnalyzeRequest
```typescript
{
  url: string  // Valid URL to analyze
}
```

### AnalyzeResponse
```typescript
{
  job_id: UUID4  // Job identifier for polling
}
```

### StatusResponse
```typescript
{
  job_id: UUID4
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "NOT_FOUND"
  result: AnalysisResult | null
  error_message: string | null
}
```

### AnalysisResult
```typescript
{
  job_id: UUID4
  url: string
  analyzed_at: string  // ISO 8601 datetime
  summary: string      // Executive summary
  overall_score: number // 0-100

  performance: {
    score: number
    metrics: {
      fcp: number      // First Contentful Paint (ms)
      lcp: number      // Largest Contentful Paint (ms)
      cls: number      // Cumulative Layout Shift
      load_time: number // Total load time (ms)
    }
  }

  accessibility: {
    score: number  // 0-100
  }

  design: {
    score: number           // 0-100
    responsive_quality: "excellent" | "good" | "fair" | "poor"
  }

  issues: {
    code: Array<{
      category: "performance" | "accessibility" | "seo" | "code-quality"
      severity: "critical" | "high" | "medium" | "low"
      title: string
      description: string
      recommendation: string
    }>
    ui: Array<{
      device: "desktop" | "tablet" | "mobile"
      category: "layout" | "typography" | "color" | "accessibility" | "spacing" | "imagery"
      severity: "critical" | "high" | "medium" | "low"
      title: string
      description: string
      location: { x: number, y: number, width: number, height: number }
      recommendation: string
    }>
  }

  priority_actions: Array<{
    action: string
    impact: "high" | "medium" | "low"
    effort: "easy" | "medium" | "hard"
  }>

  screenshots: {
    desktop: string   // API path to screenshot
    tablet: string    // API path to screenshot
    mobile: string    // API path to screenshot
  }
}
```

---

## Authentication

Currently **no authentication required** (Phase 2 implementation planned).

---

## Rate Limiting

Not implemented yet (planned for Phase 2).

---

## CORS

Default FastAPI CORS settings apply. Configure for production.

---

## Frontend API Client

Located at: `fontend/lib/api/analysis.ts`

```typescript
// Start analysis
async function startAnalysis(url: string): Promise<string>

// Poll status (implemented in use-analysis.ts hook)
async function pollStatus(jobId: string): Promise<AnalysisData>
```

---

## Error Handling

| Error Type | HTTP Status | Response Format |
|------------|-------------|-----------------|
| Invalid URL | 400 | `{"detail": "Invalid URL format"}` |
| Job Not Found | 404 | `status: "NOT_FOUND"` |
| Screenshot Not Found | 404 | `{"detail": "Screenshot file not found"}` |
| Analysis Failed | 200 | `status: "FAILED"` with error_message |
| Internal Server Error | 500 | `{"detail": "Internal server error"}` |
