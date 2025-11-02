export interface AnalysisData {
  job_id: string;
  status: string;
  created_at: string;
  completed_at: string;
  processing_time_seconds: number;
  target_url: string;
  overall_score: number;
  summary: string;
  screenshots: {
    desktop: string;
    mobile: string;
    tablet: string;
  };
  performance: {
    load_time: number;
    first_contentful_paint: number;
    time_to_interactive: number;
    total_page_size: number;
  };
  report_data: {
    issues: Array<{
      id: string;
      category: string;
      severity: string;
      title: string;
      description: string;
      recommendation: string;
    }>;
    issues_metadata: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  comparison: {
    performance: number;
    accessibility: number;
    best_practices: number;
    seo: number;
  };
  metadata: {
    analyzer_version: string;
    model_used: string;
    analysis_date: string;
  };
}

export interface AnalysisResponse {
  job_id: string;
  status: string;
}

export interface AnalysisStatus {
  status: "processing" | "completed" | "failed";
  job_id: string;
  error?: string;
}

export type AnalysisDataWithStatus = AnalysisData & AnalysisStatus;

