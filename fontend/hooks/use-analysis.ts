import { useState, useRef, useEffect } from "react";
import type { AnalysisData } from "@/types/analysis";
import { startAnalysis } from "@/lib/api/analysis";

export function useAnalysis() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    if (!urlString) return false;
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Poll job status
  const pollStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/status?job_id=${jobId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AnalysisData = await response.json();

      if (data.status === "completed") {
        setResults(data);
        setIsLoading(false);
        stopPolling();
      } else if (data.status === "failed") {
        setResults(data);
        setIsLoading(false);
        stopPolling();
      } else if (data.status === "processing") {
        console.log("Analysis in progress...");
        // Continue polling
      }
    } catch (error) {
      console.error("Polling error:", error);
      setIsLoading(false);
      stopPolling();
    }
  };

  // Setup polling
  const setupPolling = (jobId: string) => {
    stopPolling(); // Clear any existing polling

    // Poll immediately
    pollStatus(jobId);

    // Then poll every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      pollStatus(jobId);
    }, 5000);
  };

  // Start analysis
  const analyze = async () => {
    if (!isValidUrl(url)) {
      return;
    }

    setIsLoading(true);
    setResults(null);
    stopPolling(); // Clear any existing polling

    try {
      const jobId = await startAnalysis(url);
      setupPolling(jobId);
    } catch (error) {
      setIsLoading(false);
      console.error("Analysis error:", error);
    }
  };

  return {
    url,
    setUrl,
    isLoading,
    results,
    analyze,
    isValidUrl,
  };
}

