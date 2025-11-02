import { useState, useRef, useEffect } from "react";
import type { AnalysisData } from "@/types/analysis";
import { startAnalysis } from "@/lib/api/analysis";

export function useAnalysis() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Clean up event source on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
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

  // Close any existing event source
  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // Handle SSE events
  const setupEventSource = (jobId: string) => {
    closeEventSource();

    const eventSource = new EventSource(`/api/status?job_id=${jobId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as AnalysisData;

      if (data.status === "completed") {
        setResults(data);
        setIsLoading(false);
        eventSource.close();
      } else if (data.status === "failed") {
        setIsLoading(false);
        eventSource.close();
      } else if (data.status === "processing") {
        console.log("Analysis in progress...");
      }
    };

    eventSource.onerror = () => {
      setIsLoading(false);
      eventSource.close();
    };
  };

  // Start analysis
  const analyze = async () => {
    if (!isValidUrl(url)) {
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const jobId = await startAnalysis(url);
      setupEventSource(jobId);
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

