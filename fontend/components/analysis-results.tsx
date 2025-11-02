"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock, Calendar, ExternalLink, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface AnalysisResultsProps {
  data: any
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
                  href={data.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline inline-flex items-center gap-1"
                >
                  {data.target_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {data.processing_time_seconds}s
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(data.completed_at).toLocaleString("en-US")}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(data.overall_score)}`}>{data.overall_score}</div>
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
        {data.screenshots && Object.keys(data.screenshots).length > 0 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(data.screenshots).map(([key, url]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={key}
                    className="w-full h-48 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedScreenshot({ url: url || "/placeholder.svg", label: key })}
                  />
                  <p className="text-sm text-muted-foreground capitalize">{key}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Performance Metrics */}
        {data.performance && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(data.performance).map(([key, value]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                  <p className="text-2xl font-bold">{typeof value === "number" ? value.toFixed(2) : value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Issues */}
        {data.report_data?.issues && data.report_data.issues.length > 0 && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Issues Detected</h2>
              {data.report_data.issues_metadata && (
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Total: {data.report_data.issues_metadata.total || data.report_data.issues.length}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {data.report_data.issues.map((issue: any) => (
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
          </Card>
        )}

        {/* Comparison */}
        {data.comparison && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comparison</h2>
            <div className="space-y-4">
              {Object.entries(data.comparison).map(([key, value]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Metadata */}
        {data.metadata && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Analysis Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(data.metadata).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <p className="text-muted-foreground capitalize mb-1">{key.replace(/_/g, " ")}</p>
                  <p className="font-medium">{String(value)}</p>
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
