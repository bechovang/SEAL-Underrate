"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock, Calendar, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AnalysisData } from "@/types/analysis";

interface AnalysisResultsProps {
  data: AnalysisData;
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ url: string; label: string } | null>(null)

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />
      default:
        return <CheckCircle2 className="h-5 w-5 text-success" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      default:
        return "bg-success text-success-foreground"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success"
    if (score >= 70) return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <>
      <div className="space-y-6">
        {/* Overall Score */}
        <Card className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
              <p className="text-muted-foreground">
                Analysis for:{" "}
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline inline-flex items-center gap-1"
                >
                  {data.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              {data.analyzed_at && (
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(data.analyzed_at).toLocaleString("en-US")}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(data.overall_score!)}`}>{data.overall_score}</div>
              <div className="text-sm text-muted-foreground mt-2">/ 100</div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        {data.summary && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
          </Card>
        )}

        {/* Screenshots */}
        {(() => {
          console.log('Screenshots data:', data.screenshots);
          console.log('Screenshots keys:', data.screenshots ? Object.keys(data.screenshots) : 'no data');
          return data.screenshots && Object.keys(data.screenshots).length > 0;
        })() && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(data.screenshots || {}).map(([key, url]: [string, any]) => (
                url && (
                  <div key={key} className="space-y-2">
                    <img
                      src={`/api/screenshot?jobId=${data.job_id}&device=${key}`}
                      alt={key}
                      className="w-full h-48 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedScreenshot({ url: `/api/screenshot?jobId=${data.job_id}&device=${key}`, label: key })}
                    />
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                  </div>
                )
              ))}
            </div>
          </Card>
        )}

        {/* Performance Metrics */}
        {data.performance && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{data.performance.score || 'N/A'}</p>
              </div>
              {data.performance.metrics && (
                <>
                  {data.performance.metrics.fcp && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">First Contentful Paint</p>
                      <p className="text-2xl font-bold">{data.performance.metrics.fcp}ms</p>
                    </div>
                  )}
                  {data.performance.metrics.lcp && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Largest Contentful Paint</p>
                      <p className="text-2xl font-bold">{data.performance.metrics.lcp}ms</p>
                    </div>
                  )}
                  {data.performance.metrics.cls !== null && data.performance.metrics.cls !== undefined && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cumulative Layout Shift</p>
                      <p className="text-2xl font-bold">{data.performance.metrics.cls}</p>
                    </div>
                  )}
                  {data.performance.metrics.load_time && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Load Time</p>
                      <p className="text-2xl font-bold">{data.performance.metrics.load_time}ms</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        )}

        {/* Accessibility */}
        {data.accessibility && data.accessibility.score !== null && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Accessibility</h2>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(data.accessibility.score || 0)}`}>
                {data.accessibility.score}
              </div>
              <div className="text-sm text-muted-foreground mt-2">/ 100</div>
            </div>
          </Card>
        )}

        {/* Design */}
        {data.design && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Design & UX</h2>
            <div className="text-center space-y-4">
              <div>
                <div className={`text-6xl font-bold ${getScoreColor(data.design.score || 0)}`}>
                  {data.design.score}
                </div>
                <div className="text-sm text-muted-foreground mt-2">/ 100</div>
              </div>
              <div className="text-lg text-muted-foreground capitalize">
                Responsive Quality: {data.design.responsive_quality}
              </div>
            </div>
          </Card>
        )}

        {/* Issues */}
        {data.issues && (data.issues.code.length > 0 || data.issues.ui.length > 0) && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Issues Detected</h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Code Issues: {data.issues.code.length}
                </Badge>
                <Badge variant="outline">
                  UI Issues: {data.issues.ui.length}
                </Badge>
                <Badge variant="outline">
                  Total: {data.issues.code.length + data.issues.ui.length}
                </Badge>
              </div>
            </div>

            {/* Code Issues */}
            {data.issues.code.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Code & Performance Issues</h3>
                <div className="space-y-4">
                  {data.issues.code.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{getSeverityIcon(issue.severity)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Category: {issue.category}</p>
                        {issue.description && <p className="text-sm leading-relaxed">{issue.description}</p>}
                        {issue.recommendation && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Recommendation:</p>
                            <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UI Issues */}
            {data.issues.ui.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">UI & Design Issues</h3>
                <div className="space-y-4">
                  {data.issues.ui.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{getSeverityIcon(issue.severity)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Category: {issue.category} • Device: {issue.device || 'all'}
                        </p>
                        {issue.description && <p className="text-sm leading-relaxed">{issue.description}</p>}
                        {issue.location && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Location:</p>
                            <p className="text-sm text-muted-foreground">
                              x: {issue.location.x}, y: {issue.location.y}, w: {issue.location.width}, h: {issue.location.height}
                            </p>
                          </div>
                        )}
                        {issue.recommendation && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Recommendation:</p>
                            <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Priority Actions */}
        {data.priority_actions && data.priority_actions.length > 0 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Priority Actions</h2>
            <div className="space-y-4">
              {data.priority_actions.map((action: any) => (
                <div
                  key={action.id}
                  className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-lg">{action.action}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          Impact: {action.impact}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          Effort: {action.effort}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black/95">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            {selectedScreenshot && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <img
                  src={selectedScreenshot.url || "/placeholder.svg"}
                  alt={selectedScreenshot.label}
                  className="max-w-full max-h-full object-contain"
                />
                <p className="text-white text-lg mt-4 capitalize">{selectedScreenshot.label}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
