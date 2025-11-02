"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AnalysisResults, AnalysisLoading } from "@/components/analysis";
import { Search } from "lucide-react";
import { useAnalysis } from "@/hooks/use-analysis";

export default function Home() {
  const { url, setUrl, isLoading, results, analyze, isValidUrl } =
    useAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyze();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Website Analysis
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Enter any website URL to receive a detailed report on performance,
            accessibility, and technical issues
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-8 mb-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !isValidUrl(url)}
              size="lg"
              className="px-8"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </Card>

        {/* Loading State */}
        {isLoading && <AnalysisLoading />}

        {/* Results */}
        {results && !isLoading && <AnalysisResults data={results} />}
      </div>
    </main>
  );
}
