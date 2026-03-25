# Frontend Architecture

## Overview

The frontend is a **Next.js 16** web application built with **React 19** and **TypeScript**, using the App Router pattern for file-based routing and component-based architecture.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | React framework with App Router |
| **UI Library** | React 19 | Component rendering |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Components** | Radix UI | Accessible component primitives |
| **Charts** | Recharts | Data visualization |
| **State** | React Hooks | Local component state |

## Architecture Pattern

### Component-Based Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App Router                │
│  (File-based routing, Server/Client Components)     │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────▼────────┐              ┌─────────▼────────┐
│  UI Components │              │ Feature Modules  │
│  (Radix UI)    │              │  (analysis/)     │
└────────────────┘              └──────────────────┘
        │                                 │
        └────────────────┬────────────────┘
                         │
              ┌──────────▼──────────┐
              │   Custom Hooks      │
              │  (use-analysis)     │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │   API Client       │
              │  (lib/api/)        │
              └─────────────────────┘
```

## Directory Structure

```
fontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page (Client Component)
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading state
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # 40+ Radix UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (40+ components)
│   ├── analysis/         # Feature components
│   │   ├── loading.tsx
│   │   └── results.tsx
│   └── theme-provider.tsx
├── hooks/
│   ├── use-analysis.ts   # Analysis state + polling
│   ├── use-mobile.ts     # Device detection
│   └── use-toast.ts      # Toast notifications
├── lib/
│   ├── api/
│   │   └── analysis.ts   # API client functions
│   ├── constants/
│   │   └── mock-data.ts
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Component Architecture

### Page Component (`app/page.tsx`)

**Type:** Client Component ("use client")

**Responsibilities:**
- Render URL input form
- Display loading state during analysis
- Show analysis results when complete

**Key Features:**
- Uses `useAnalysis` hook for all state management
- Form validation with URL format checking
- Responsive layout with Tailwind CSS

```typescript
// Key hooks used
const { url, setUrl, isLoading, results, analyze, isValidUrl } = useAnalysis();
```

### Custom Hooks

#### `use-analysis.ts` - Core Analysis Hook

**Responsibilities:**
- Manage URL input state
- Handle loading/processing states
- Poll backend for job status
- Store and expose results

**Key Functions:**
- `analyze()` - Starts analysis job and begins polling
- `pollStatus()` - Checks job status every 5 seconds
- `isValidUrl()` - Validates URL format

**Polling Strategy:**
- Polls every 5 seconds while status is PROCESSING
- Stops polling on COMPLETED or FAILED
- Cleans up interval on component unmount

#### `use-mobile.ts` - Device Detection

Detects if user is on a mobile device for responsive UI.

#### `use-toast.ts` - Toast Notifications

Manages toast notification state for user feedback.

### UI Components (shadcn/ui)

Based on **Radix UI** primitives with **Tailwind CSS** styling.

**Component Categories:**
- **Form:** button, input, checkbox, select, textarea
- **Layout:** card, separator, scroll-area, resizable
- **Feedback:** alert, toast, sonner, progress, skeleton
- **Navigation:** tabs, breadcrumb, navigation-menu, menubar
- **Overlays:** dialog, popover, tooltip, sheet, drawer
- **Data Display:** table, badge, avatar, calendar, chart
- **Advanced:** command, carousel, form, input-otp

## State Management

### Local Component State

Primary state management approach using React hooks:

```typescript
// Example: use-analysis.ts
const [url, setUrl] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [results, setResults] = useState<AnalysisData | null>(null);
```

### No Global State

The application does not use Redux, Zustand, or Context API for global state. All state is local to components or shared via custom hooks.

## Data Fetching

### API Client (`lib/api/analysis.ts`)

```typescript
async function startAnalysis(url: string): Promise<string> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  return data.job_id;
}
```

### Polling Strategy

The frontend polls the backend for job status:

1. **Initial Request:** POST to `/api/analyze` → returns `job_id`
2. **Polling Loop:** GET `/status?job_id={id}` every 5 seconds
3. **Completion:** Stop polling when status is COMPLETED or FAILED

**Why Polling?**
- Simple implementation
- No WebSocket complexity
- Suitable for user-triggered, async operations

## Routing

### App Router Pattern

Next.js 16 uses the **App Router** with file-based routing:

```
app/
├── page.tsx        → /
├── layout.tsx      → Root layout wrapper
└── loading.tsx     → Loading fallback
```

**Current Routes:**
- `/` - Main page (URL input and analysis results)

**Future Routes (planned):**
- `/history` - Past analyses
- `/about` - About page

## Styling Architecture

### Tailwind CSS 4

Utility-first CSS framework with PostCSS integration.

**Configuration:** `tailwind.config.ts`, `postcss.config.mjs`

**Theme Support:**
- Dark/light mode via `next-themes`
- CSS variables for theming
- `className` patterns for responsive design

### CSS Modules

Global styles in `app/globals.css` and `styles/globals.css`.

## Type Definitions

### Analysis Types

```typescript
interface AnalysisData {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed" | "not_found";
  result: AnalysisResult | null;
  error_message: string | null;
}

interface AnalysisResult {
  job_id: string;
  url: string;
  analyzed_at: string;
  summary: string;
  overall_score: number;
  performance: PerformanceScore;
  accessibility: { score: number };
  design: DesignScore;
  issues: IssueSet;
  priority_actions: PriorityAction[];
  screenshots: ScreenshotPaths;
}
```

## Performance Considerations

### Next.js Optimizations

- **Server/Client Components:** App Router automatically optimizes
- **Image Optimization:** Next.js Image component (not currently used)
- **Code Splitting:** Automatic per route

### Client-Side Optimizations

- **Polling Interval:** 5 seconds (configurable)
- **Lazy Loading:** Components loaded on demand
- **Memoization:** React.memo for expensive components (opportunity)

## Integration with Backend

### API Communication

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Next.js)     │         │   (FastAPI)     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ POST /api/analyze         │
         ├──────────────────────────>│
         │                           │
         │    { job_id }             │
         │<──────────────────────────┤
         │                           │
         │  Poll: GET /status        │
         │  (every 5s)               │
         ├──────────────────────────>│
         │                           │
         │    { status, result }     │
         │<──────────────────────────┤
         │                           │
         │  GET /screenshot/{id}/dev │
         ├──────────────────────────>│
         │                           │
         │    <image/png>            │
         │<──────────────────────────┤
```

### Request Flow

1. User enters URL and clicks "Analyze"
2. `use-analysis.ts` calls `startAnalysis()`
3. API client POSTs to backend `/analyze`
4. Backend returns `job_id`
5. Frontend starts polling `/status?job_id={id}`
6. On completion, results displayed via `AnalysisResults` component

## Development Workflow

### Local Development

```bash
cd fontend
npm install
npm run dev
```

**Development Server:** http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Future Enhancements

### Potential Improvements

1. **State Management:** Consider Zustand for complex state
2. **Real-time Updates:** WebSocket or SSE instead of polling
3. **Error Handling:** Retry logic for failed requests
4. **Optimistic UI:** Show progress indicators
5. **Caching:** Cache analysis results locally
6. **Analytics:** Track user behavior with Plausible/Analytics
