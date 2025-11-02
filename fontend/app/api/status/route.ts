import { type NextRequest, NextResponse } from "next/server";
import type { BackendJobResponse, AnalysisData } from "@/types/analysis";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function transformBackendToFrontend(backend: BackendJobResponse): AnalysisData {
  const status = backend.status.toLowerCase() as AnalysisData["status"];

  if (status === "completed" && backend.result) {
    const result = backend.result;

    // Transform issues to add IDs and combine code/ui issues
    const allIssues = [
      ...result.issues.code.map((issue, index) => ({
        ...issue,
        id: `code-${index}`,
      })),
      ...result.issues.ui.map((issue, index) => ({
        ...issue,
        id: `ui-${index}`,
      })),
    ];

    // Transform actions to add IDs
    const actions = result.priority_actions.map((action, index) => ({
      ...action,
      id: `action-${index}`,
    }));

    return {
      job_id: result.job_id,
      status: "completed",
      url: result.url,
      analyzed_at: result.analyzed_at,
      overall_score: result.overall_score,
      summary: result.summary,
      performance: {
        score: result.performance.score || undefined,
        metrics: {
          fcp: result.performance.metrics.fcp || undefined,
          lcp: result.performance.metrics.lcp || undefined,
          cls: result.performance.metrics.cls || undefined,
          load_time: result.performance.metrics.load_time || undefined,
        }
      },
      accessibility: {
        score: result.accessibility.score || undefined,
      },
      design: result.design,
      issues: {
        code: allIssues.filter(issue => issue.category.includes('performance') ||
                                        issue.category.includes('accessibility') ||
                                        issue.category.includes('seo') ||
                                        issue.category.includes('code-quality')),
        ui: allIssues.filter(issue => issue.category.includes('layout') ||
                                     issue.category.includes('typography') ||
                                     issue.category.includes('color') ||
                                     issue.category.includes('spacing') ||
                                     issue.category.includes('imagery')),
      },
      priority_actions: actions,
      screenshots: result.screenshots,
      error_message: backend.error_message || undefined,
    };
  }

  return {
    job_id: backend.job_id,
    status,
    error_message: backend.error_message || undefined,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const job_id = url.searchParams.get("job_id");

  if (!job_id) {
    return NextResponse.json({ error: "job_id is required" }, { status: 400 });
  }

  try {
    // Poll backend API for job status
    const response = await fetch(`${BACKEND_URL}/api/v1/status/${job_id}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch job status" },
        { status: response.status }
      );
    }

    const backendData: BackendJobResponse = await response.json();
    const frontendData = transformBackendToFrontend(backendData);

    return NextResponse.json(frontendData);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check job status" },
      { status: 500 }
    );
  }
}
