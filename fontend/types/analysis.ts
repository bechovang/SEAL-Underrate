// Backend API response types
export interface BackendJobResponse {
  job_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "NOT_FOUND";
  result?: BackendAnalysisResult;
  error_message?: string | null;
}

export interface BackendAnalysisResult {
  job_id: string;
  url: string;
  analyzed_at: string;
  summary: string;
  overall_score: number;
  performance: {
    score: number;
    metrics: {
      fcp: number | null;
      lcp: number | null;
      cls: number | null;
      load_time: number | null;
    };
  };
  accessibility: {
    score: number | null;
  };
  design: {
    score: number;
    responsive_quality: "excellent" | "good" | "fair" | "poor";
  };
  issues: {
    code: BackendIssue[];
    ui: BackendIssue[];
  };
  priority_actions: BackendAction[];
  screenshots: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

export interface BackendIssue {
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface BackendAction {
  action: string;
  impact: "high" | "medium" | "low";
  effort: "easy" | "medium" | "hard";
}

// Frontend types (transformed from backend)
export interface AnalysisData {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  url?: string;
  analyzed_at?: string;
  overall_score?: number;
  summary?: string;
  performance?: {
    score?: number;
    metrics?: {
      fcp?: number;
      lcp?: number;
      cls?: number;
      load_time?: number;
    };
  };
  accessibility?: {
    score?: number;
  };
  design?: {
    score?: number;
    responsive_quality?: string;
  };
  issues?: {
    code: Issue[];
    ui: Issue[];
  };
  priority_actions?: Action[];
  screenshots?: {
    desktop?: string;
    mobile?: string;
    tablet?: string;
  };
  error_message?: string;
}

export interface Issue {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Action {
  id: string;
  action: string;
  impact: "high" | "medium" | "low";
  effort: "easy" | "medium" | "hard";
}

export interface AnalysisResponse {
  job_id: string;
}

export interface AnalysisStatus {
  status: "pending" | "processing" | "completed" | "failed";
  job_id: string;
  error?: string;
}

export type AnalysisDataWithStatus = AnalysisData & AnalysisStatus;

