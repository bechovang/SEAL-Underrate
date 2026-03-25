# Source Tree Analysis

## Project Structure

```
SEAL-Underrate/
├── fontend/                    # Next.js Frontend Application
│   ├── app/                   # Next.js App Router (Server/Client Components)
│   │   ├── page.tsx          # Main page - URL input and analysis results
│   │   ├── loading.tsx       # Loading page component
│   │   └── globals.css       # Global styles
│   ├── components/           # React Components
│   │   ├── ui/              # Radix UI components (40+ components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button-group.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── empty.tsx
│   │   │   ├── field.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-group.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── item.tsx
│   │   │   ├── kbd.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-mobile.tsx
│   │   ├── analysis/        # Analysis feature components
│   │   │   ├── index.ts    # Component exports
│   │   │   ├── loading.tsx # Loading state display
│   │   │   └── results.tsx # Analysis results display
│   │   └── theme-provider.tsx # Dark/Light theme provider
│   ├── hooks/              # Custom React Hooks
│   │   ├── use-analysis.ts # Analysis state and polling logic
│   │   ├── use-mobile.ts   # Mobile device detection
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/                # Utilities
│   │   ├── api/           # API client functions
│   │   │   └── analysis.ts # Analysis API calls
│   │   ├── constants/     # Constants
│   │   │   └── mock-data.ts
│   │   └── utils.ts       # Utility functions (cn, clsx, etc.)
│   ├── public/            # Static assets
│   │   ├── desktop-website-screenshot.png
│   │   ├── mobile-website-screenshot.png
│   │   ├── tablet-website-screenshot.png
│   │   └── placeholder-*.png/svg/jpg
│   ├── styles/            # Additional styles
│   │   └── globals.css
│   ├── components.json    # shadcn/ui component configuration
│   ├── next.config.mjs    # Next.js configuration
│   ├── package.json       # NPM dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   ├── postcss.config.mjs # PostCSS configuration
│   ├── tailwind.config.ts # Tailwind CSS configuration
│   └── pnpm-lock.yaml     # PNPM lock file
├── backend/              # FastAPI Backend Application
│   ├── app/             # Application source code
│   │   ├── __init__.py
│   │   ├── main.py      # FastAPI app entry point → Routes to /api/v1
│   │   ├── database.py  # Database connection and session management
│   │   ├── schemas.py   # Pydantic request/response models
│   │   ├── api/         # API endpoint definitions
│   │   │   ├── __init__.py
│   │   │   └── endpoints.py # POST /analyze, GET /status, GET /screenshot
│   │   ├── models/      # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   └── job.py   # Job model (analysis jobs table)
│   │   ├── services/    # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── analyzer.py      # Analysis workflow orchestration
│   │   │   ├── ai_agents.py     # OpenRouter/AI integration
│   │   │   └── data_collector.py # Playwright screenshot/data collection
│   │   └── utils/       # Utilities
│   │       └── config.py # Environment configuration
│   ├── alembic/         # Database migrations
│   │   ├── versions/    # Migration version files
│   │   │   └── a2a791f91c40_create_jobs_table.py
│   │   └── env.py       # Alembic environment
│   ├── alembic.ini      # Alembic configuration
│   ├── requirements.txt # Python dependencies
│   ├── .env             # Environment variables (DATABASE_URL, API keys)
│   ├── env.example      # Environment template
│   └── venv/            # Python virtual environment
├── docs/               # Generated documentation (this folder)
│   ├── project-overview.md
│   ├── source-tree-analysis.md
│   └── ...
├── README.md           # Main project documentation
└── _bmad/             # BMad framework configuration
```

## Critical Folders Explained

### Frontend Critical Paths

| Path | Purpose |
|------|---------|
| `fontend/app/` | Next.js App Router - defines pages and layouts |
| `fontend/components/ui/` | Reusable UI components from Radix UI/shadcn |
| `fontend/components/analysis/` | Feature-specific analysis components |
| `fontend/hooks/` | Custom React hooks for state management |
| `fontend/lib/api/` | API client functions for backend communication |

### Backend Critical Paths

| Path | Purpose |
|------|---------|
| `backend/app/api/endpoints.py` | REST API endpoint definitions |
| `backend/app/services/analyzer.py` | Main analysis workflow orchestration |
| `backend/app/services/ai_agents.py` | AI integration (OpenRouter/Claude) |
| `backend/app/services/data_collector.py` | Playwright browser automation |
| `backend/app/models/job.py` | Database model for analysis jobs |
| `backend/alembic/versions/` | Database migration scripts |

## Entry Points

| Part | Entry Point | Description |
|------|-------------|-------------|
| Frontend | `fontend/app/page.tsx` | Main page with URL input and results display |
| Backend | `backend/app/main.py` | FastAPI application with API routes |

## Integration Points

- **Frontend → Backend**: `fontend/lib/api/analysis.ts` → `backend/app/api/endpoints.py`
- **Background Jobs**: FastAPI BackgroundTasks → `analyzer.py` → Async processing
- **Database**: SQLAlchemy ORM via `database.py` → PostgreSQL
- **AI Services**: `ai_agents.py` → OpenRouter API
- **Browser Automation**: `data_collector.py` → Playwright Chromium

## File Organization Patterns

### Frontend
- **App Router**: File-based routing in `app/` directory
- **Component Co-location**: UI components in `components/ui/`
- **Feature Modules**: Related components grouped (e.g., `analysis/`)
- **Custom Hooks**: Reusable state logic in `hooks/`

### Backend
- **Layered Architecture**: api → services → models separation
- **Dependency Injection**: Database session via FastAPI Depends()
- **Background Tasks**: Async job processing with BackgroundTasks
- **Configuration**: Environment-based via `.env` file
