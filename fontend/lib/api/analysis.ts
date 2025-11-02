import type { AnalysisResponse } from "@/types/analysis";

export async function startAnalysis(url: string): Promise<string> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to start analysis");
  }

  const data: AnalysisResponse = await response.json();
  return data.job_id;
}

