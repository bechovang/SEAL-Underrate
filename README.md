# SEAL Underrate - AI UI/UX Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40-orange)](https://playwright.dev/)

An intelligent web application that analyzes websites using AI to provide comprehensive UI/UX analysis, performance metrics, accessibility audits, and actionable improvement recommendations.

## 🌟 Features

### 🔍 **Comprehensive Analysis**
- **Performance Analysis**: Load times, Core Web Vitals (FCP, LCP, CLS)
- **Accessibility Audit**: WCAG compliance, contrast ratios, screen reader compatibility
- **UI/UX Evaluation**: Visual hierarchy, responsive design, user experience
- **SEO Assessment**: Meta tags, structured data, search engine optimization
- **Code Quality**: HTML validation, semantic markup, best practices

### 🤖 **AI-Powered Insights**
- **Claude 3.5 Sonnet Integration**: Advanced AI analysis via OpenRouter
- **Multi-Device Screenshots**: Desktop, tablet, and mobile views
- **Intelligent Recommendations**: Prioritized action items with impact assessment
- **Natural Language Reports**: Human-readable executive summaries

### 🎨 **Modern Web Interface**
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: Live status tracking during analysis
- **Interactive Visualizations**: Charts, metrics, and issue categorization
- **Dark/Light Theme**: User preference-based theming

### ⚡ **High Performance**
- **Asynchronous Processing**: Non-blocking analysis jobs
- **Background Tasks**: Efficient resource utilization
- **Caching**: Optimized image and data delivery
- **Scalable Architecture**: Built for concurrent users

## 🛠 Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **SQLAlchemy**: Modern ORM with async support
- **PostgreSQL**: Robust relational database
- **Alembic**: Database migration management
- **Playwright**: Headless browser automation
- **OpenRouter API**: AI model access

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization library

### DevOps
- **Docker**: Containerization (optional)
- **Python venv**: Virtual environment management
- **npm/pnpm**: Package management

## 📋 Prerequisites

### System Requirements
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Git**

### API Keys
- **OpenRouter API Key**: [Get from OpenRouter.ai](https://openrouter.ai/keys)
- **PostgreSQL Database**: Local or cloud instance

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/seal-underrate.git
cd seal-underrate
```

### 2. Backend Setup

#### Environment Configuration
```bash
cd backend

# Copy environment template
cp env.example .env

# Edit .env with your values
nano .env
```

**Required .env variables:**
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost/ui_analyzer_db

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Optional: Model Configuration
CODE_ANALYST_MODEL=anthropic/claude-3.5-sonnet
VISION_ANALYST_MODEL=anthropic/claude-3.5-sonnet
SYNTHESIZER_MODEL=anthropic/claude-3.5-sonnet
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb ui_analyzer_db

# Install Python dependencies
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

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
# or
pnpm install

# Optional: Configure environment
cp .env.example .env.local

# Start development server
npm run dev
# or
pnpm dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Currently no authentication required (Phase 2 implementation).

### Endpoints

#### POST `/analyze`
Submit a URL for analysis.

**Request:**
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
Check analysis job status.

**Response:**
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
      "code": [...],
      "ui": [...]
    },
    "priority_actions": [...],
    "screenshots": {
      "desktop": "/api/v1/screenshot/job_id/desktop",
      "tablet": "/api/v1/screenshot/job_id/tablet",
      "mobile": "/api/v1/screenshot/job_id/mobile"
    }
  },
  "error_message": null
}
```

#### GET `/screenshot/{job_id}/{device}`
Retrieve analysis screenshots.

**Parameters:**
- `job_id`: Analysis job ID
- `device`: `desktop` | `tablet` | `mobile`

**Response:** PNG image file

## 🎨 Frontend Usage

### Basic Workflow

1. **Enter URL**: Input any website URL in the search field
2. **Start Analysis**: Click "Analyze" button
3. **Monitor Progress**: Watch real-time status updates
4. **View Results**: Explore comprehensive analysis report

### Features

#### 📊 Dashboard
- Overall performance score (0-100)
- Category-specific metrics
- Executive summary with AI insights

#### 🔍 Issues Panel
- **Code Issues**: Performance, accessibility, SEO problems
- **UI Issues**: Design, typography, layout concerns
- Severity levels: Critical, High, Medium, Low
- Location coordinates for UI issues

#### 📋 Priority Actions
- Actionable recommendations
- Impact assessment (High/Medium/Low)
- Effort estimation (Easy/Medium/Hard)

#### 📸 Screenshots
- Multi-device captures (Desktop/Tablet/Mobile)
- Click to enlarge modal view
- Actual website screenshots used for AI analysis

## 🔧 Development

### Backend Development

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
pytest

# Code formatting
black .
isort .

# Type checking
mypy .
```

### Frontend Development

```bash
cd fontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Database Management

```bash
cd backend

# Create new migration
alembic revision -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🐳 Docker Deployment (Optional)

### Build Images
```bash
# Backend
cd backend
docker build -t seal-backend .

# Frontend
cd fontend
docker build -t seal-frontend .
```

### Run with Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ui_analyzer_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password

  backend:
    image: seal-backend
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    image: seal-frontend
    ports:
      - "3000:3000"
```

## 📊 Monitoring & Analytics

### Backend Metrics
- Job completion rates
- Analysis duration statistics
- API response times
- Error rates by category

### Frontend Analytics
- User interaction tracking
- Conversion funnel analysis
- Performance monitoring

## 🔒 Security Considerations

### API Security
- Rate limiting implementation
- Input validation and sanitization
- CORS configuration
- Error message sanitization

### Data Privacy
- No user data storage
- Temporary file cleanup
- Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- **Backend**: Black, isort, mypy
- **Frontend**: ESLint, Prettier
- **Commits**: Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** for Claude AI models
- **OpenRouter** for AI API access
- **FastAPI** team for excellent documentation
- **Next.js** team for the amazing framework
- **Playwright** for browser automation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/seal-underrate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/seal-underrate/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ for better web experiences**
