# SEAL Underrate - AI UI/UX Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.49-orange)](https://playwright.dev/)
[![SEAL Hackathon 2025](https://img.shields.io/badge/SEAL_Hackathon_2025-Top_3_Finalist-purple)](https://www.facebook.com/share/p/1BGaAMGyCZ/)

An intelligent web application that analyzes websites using AI to provide comprehensive UI/UX analysis, performance metrics, accessibility audits, and actionable improvement recommendations.

## 🏆 Awards & Recognition

**🥉 SEAL Hackathon 2025 - Top 3 Finalist**

Team **Underrate** achieved Top 3 placement in the SEAL Hackathon 2025 with this AI-powered UI/UX analyzer, demonstrating innovative use of AI for web analysis and comprehensive evaluation capabilities.

📢 [View Official Results Announcement](https://www.facebook.com/share/p/1BGaAMGyCZ/)

## 🌟 Features

### 🔍 **Comprehensive Analysis**

- **Performance Analysis**: Load times, Core Web Vitals (FCP, LCP, CLS)
- **Accessibility Audit**: WCAG compliance, contrast ratios, screen reader compatibility
- **UI/UX Evaluation**: Visual hierarchy, responsive design, user experience
- **SEO Assessment**: Meta tags, structured data, search engine optimization
- **Code Quality**: HTML validation, semantic markup, best practices

### 🤖 **AI-Powered Insights**

- **Claude 3.5 Sonnet Integration**: Advanced AI analysis via OpenRouter
- **Multi-Device Screenshots**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Intelligent Recommendations**: Prioritized action items with impact assessment
- **Natural Language Reports**: Human-readable executive summaries

### 🎨 **Modern Web Interface**

- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: Polling-based status tracking (5-second intervals)
- **Interactive Visualizations**: Charts, metrics, and issue categorization
- **Dark/Light Theme**: User preference-based theming

### ⚡ **High Performance**

- **Asynchronous Processing**: Non-blocking analysis jobs
- **Background Tasks**: FastAPI BackgroundTasks for efficient resource utilization
- **Image Optimization**: Screenshots resized to 512px max dimension
- **Scalable Architecture**: Built for concurrent users

## 🛠 Tech Stack

### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | FastAPI | 0.115+ |
| **Python** | Python | 3.11+ |
| **Database** | PostgreSQL | 15+ |
| **ORM** | SQLAlchemy | 2.0+ |
| **Migrations** | Alembic | 1.13+ |
| **Browser Automation** | Playwright | 1.49+ |
| **AI Provider** | OpenRouter (Claude 3.5 Sonnet) | - |
| **HTTP Client** | aiohttp | 3.11+ |

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | 16.0 |
| **UI Library** | React | 19.2 |
| **Language** | TypeScript | 5.7+ |
| **Styling** | Tailwind CSS | 4.1+ |
| **Component Library** | Radix UI (shadcn/ui) | - |
| **Charts** | Recharts | 2.15+ |
| **Forms** | React Hook Form | 7.60+ |

### DevOps & Infrastructure

- **Virtual Environment**: Python venv
- **Package Managers**: npm, pip
- **Database**: PostgreSQL (local or Railway)
- **Frontend Hosting**: Vercel (recommended)
- **Backend Hosting**: Railway (recommended)

## 📋 Prerequisites

### System Requirements

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Git**

### API Keys Required

- **OpenRouter API Key**: [Get from OpenRouter.ai](https://openrouter.ai/keys)
  - Required for AI-powered analysis
  - Models used: `anthropic/claude-3.5-sonnet`
- **PostgreSQL Database**: Local instance or cloud provider

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/seal-underrate.git
cd seal-underrate
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browser
playwright install chromium

# Create .env file
cp env.example .env
```

#### Environment Configuration (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost/ui_analyzer_db

# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# AI Model Configuration (Optional - defaults to Claude 3.5 Sonnet)
CODE_ANALYST_MODEL=anthropic/claude-3.5-sonnet
VISION_ANALYST_MODEL=anthropic/claude-3.5-sonnet
SYNTHESIZER_MODEL=anthropic/claude-3.5-sonnet
```

#### Database Setup

```bash
# Create PostgreSQL database
createdb ui_analyzer_db

# Or using psql
psql -U postgres
CREATE DATABASE ui_analyzer_db;
\q

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd fontend

# Install dependencies
npm install

# Create environment file (optional)
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

### 4. Access Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8000 | REST API |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |

## 📖 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Endpoints

#### POST `/analyze`

Submit a URL for AI-powered analysis.

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

#### GET `/status/{job_id}`

Check analysis job status and retrieve results.

**Response (Processing):**

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PROCESSING",
  "result": null,
  "error_message": null
}
```

**Response (Completed):**

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED",
  "result": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://example.com",
    "analyzed_at": "2025-11-02T05:44:54.212830",
    "summary": "Technical analysis reveals...",
    "overall_score": 82,
    "performance": {
      "score": 90,
      "metrics": {
        "fcp": 160,
        "lcp": 200,
        "cls": 0.1,
        "load_time": 500
      }
    },
    "accessibility": {"score": 85},
    "design": {
      "score": 65,
      "responsive_quality": "fair"
    },
    "issues": {
      "code": [
        {
          "category": "performance",
          "severity": "low",
          "title": "Unoptimized external script loading",
          "description": "...",
          "recommendation": "..."
        }
      ],
      "ui": [
        {
          "device": "mobile",
          "category": "spacing",
          "severity": "medium",
          "title": "Inconsistent margins",
          "location": {"x": 0, "y": 0, "width": 375, "height": 200},
          "recommendation": "..."
        }
      ]
    },
    "priority_actions": [
      {
        "action": "Implement ARIA landmarks...",
        "impact": "high",
        "effort": "medium"
      }
    ],
    "screenshots": {
      "desktop": "C:\\Users\\...\\desktop.png",
      "tablet": "C:\\Users\\...\\tablet.png",
      "mobile": "C:\\Users\\...\\mobile.png"
    }
  },
  "error_message": null
}
```

#### GET `/screenshot/{job_id}/{device}`

Retrieve analysis screenshot image.

**Path Parameters:**
- `job_id`: Analysis job ID (UUID)
- `device`: `desktop` | `tablet` | `mobile`

**Response:** PNG image file with proper caching headers

## 🎨 Frontend Usage

### Analysis Workflow

1. **Enter URL**: Input any valid website URL
2. **Start Analysis**: Click "Analyze" button
3. **Monitor Progress**: Real-time status updates every 5 seconds
4. **View Results**: Comprehensive analysis report with:

### Results Components

#### 📊 Overview Dashboard
- Overall score (0-100)
- Target URL with external link
- Analysis timestamp
- Category-specific scores

#### 📸 Multi-Device Screenshots
- Desktop, Tablet, Mobile captures
- Click-to-expand modal view
- Actual website screenshots used for AI vision analysis

#### ⚡ Performance Metrics
- Performance Score (0-100)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Page Load Time

#### ♿ Accessibility Score
- Overall accessibility rating (0-100)

#### 🎨 Design & UX Score
- Overall design rating (0-100)
- Responsive quality assessment
- Positive aspects identified

#### 🐛 Issues Detected

**Code Issues:**
- Performance problems
- Accessibility violations
- SEO concerns
- Code quality issues

**UI Issues:**
- Layout problems
- Typography issues
- Color/contrast problems
- Spacing inconsistencies
- Device-specific concerns

Each issue includes:
- Severity level (Critical/High/Medium/Low)
- Category classification
- Detailed description
- Location coordinates (for UI issues)
- Actionable recommendation

#### 📋 Priority Actions
- Recommended improvements
- Impact assessment (High/Medium/Low)
- Effort estimation (Easy/Medium/Hard)

## 🔧 Development Guide

### Backend Development

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests (when implemented)
pytest

# Database migration
alembic revision -m "description"
alembic upgrade head

# Check database
python test_db.py
```

### Frontend Development

```bash
cd fontend

# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Management

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## 🐛 Troubleshooting

### Common Issues

#### 1. API Key 401 Unauthorized Error

**Problem:** Analysis fails with `401 Unauthorized` error.

**Solution:**
- Verify OpenRouter API key is valid at https://openrouter.ai/keys
- Ensure `.env` file exists in `backend/` directory
- Check API key format: `sk-or-v1-...`
- Restart backend after updating `.env`:
  ```bash
  # Kill existing process
  taskkill /F /IM python.exe  # Windows
  # or
  pkill -f uvicorn  # Linux/Mac

  # Start fresh
  cd backend
  source venv/bin/activate
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```

#### 2. Port Already in Use

**Problem:** `Error: [Errno 48] Address already in use`

**Solution:**
```bash
# Find process on port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Linux/Mac

# Kill the process
taskkill /F /PID <PID>  # Windows
kill -9 <PID>  # Linux/Mac
```

#### 3. Playwright Browser Not Found

**Problem:** `Executable doesn't exist`

**Solution:**
```bash
cd backend
source venv/bin/activate
playwright install chromium
```

#### 4. Database Connection Error

**Problem:** `connection to server at "localhost", port 5432 failed`

**Solution:**
```bash
# Ensure PostgreSQL is running
# Windows: Check Services
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql

# Verify database exists
psql -U postgres -l | grep ui_analyzer_db

# Create if not exists
createdb -U postgres ui_analyzer_db
```

#### 5. Screenshots Not Displaying

**Problem:** "Screenshots data: undefined" in console

**Solution:**
- Check if analysis completed successfully
- Verify screenshot files exist in temp directory
- Check backend logs for errors during screenshot capture
- Ensure sufficient disk space for temporary files

#### 6. Frontend Cannot Connect to Backend

**Problem:** API calls fail with network error

**Solution:**
- Verify backend is running on port 8000
- Check CORS configuration in backend
- Ensure `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check firewall settings

### Debug Mode

```bash
# Backend: Enable verbose logging
uvicorn app.main:app --reload --log-level debug

# Frontend: Check browser console
# Open DevTools (F12) and check Console tab
```

## 📊 Project Structure

```
seal-underrate/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py          # API routes
│   │   ├── models/
│   │   │   └── job.py                 # Database models
│   │   ├── services/
│   │   │   ├── ai_agents.py           # AI analysis services
│   │   │   ├── analyzer.py            # Analysis orchestration
│   │   │   └── data_collector.py      # Data collection (Playwright)
│   │   ├── utils/
│   │   │   └── config.py              # Configuration management
│   │   ├── database.py                # Database connection
│   │   └── main.py                    # FastAPI app entry
│   ├── alembic/                       # Database migrations
│   ├── venv/                          # Python virtual environment
│   ├── .env                           # Environment variables
│   └── requirements.txt               # Python dependencies
│
├── fontend/
│   ├── app/
│   │   ├── api/                       # Next.js API routes (proxy)
│   │   │   ├── analyze/
│   │   │   ├── status/
│   │   │   └── screenshot/
│   │   ├── components/
│   │   │   ├── analysis/              # Analysis components
│   │   │   └── ui/                    # UI components (shadcn)
│   │   ├── hooks/
│   │   │   └── use-analysis.ts        # Analysis state hook
│   │   ├── lib/
│   │   │   └── api/
│   │   ├── types/
│   │   │   └── analysis.ts            # TypeScript types
│   │   ├── page.tsx                   # Home page
│   │   └── layout.tsx                 # Root layout
│   ├── node_modules/
│   ├── package.json
│   └── tailwind.config.ts
│
├── docs/                              # Project documentation
│   ├── index.md
│   ├── architecture-backend.md
│   ├── architecture-frontend.md
│   ├── api-contracts.md
│   └── ...
│
└── README.md
```

## 🔒 Security Considerations

### API Security (Current - Phase 1)

- Input validation on all endpoints
- URL validation before analysis
- Error message sanitization
- CORS configuration for frontend access

### Planned (Phase 2)

- Rate limiting per IP
- API key authentication
- User authentication system
- Job ownership verification

### Data Privacy

- No user data storage
- Temporary screenshot files (cleaned after analysis)
- Secure API key management via environment variables
- No logging of analyzed URLs

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd fontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm i -g railway

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables for Production

```bash
# Backend (Railway)
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Frontend (Vercel)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

## 📈 Performance Optimization

### Backend Optimizations

- Async/await for all I/O operations
- Connection pooling for database
- Background task processing
- Screenshot size optimization (512px max dimension)
- Efficient memory management for large payloads

### Frontend Optimizations

- Next.js Image optimization
- Code splitting by route
- Lazy loading for heavy components
- Debounced user input
- Optimistic UI updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style Guidelines

- **Backend**: Follow PEP 8, use Black formatter
- **Frontend**: Follow ESLint rules, use Prettier
- **Commits**: Use conventional commit format
  - `feat: Add new feature`
  - `fix: Fix bug`
  - `docs: Update documentation`
  - `refactor: Refactor code`

## 🙏 Acknowledgments

- **Anthropic** for Claude AI models
- **OpenRouter** for AI API access
- **FastAPI** team for excellent documentation
- **Next.js** team for the amazing framework
- **Playwright** for browser automation
- **Radix UI** for accessible components
- **SEAL Hackathon 2025** organizers

## Developed by 
- Nguyen Ngoc Phuc - FPT University - SE203055
- Than Nhat Huy - FPT University - SE203317
- Dam Le Tuan Anh - FPT University - SE204111
## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for better web experiences**

*Team Underrate - SEAL Hackathon 2025*
