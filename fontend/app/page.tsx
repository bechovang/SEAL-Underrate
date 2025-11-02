"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AnalysisResults } from "@/components/analysis-results"
import { AnalysisLoading } from "@/components/analysis-loading"
import { Search } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      toast({
        title: "Error",
        description: "Invalid URL format",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResults(null)

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to start analysis")
      }

      const { job_id } = await response.json()

      const eventSource = new EventSource(`/api/status?job_id=${job_id}`)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.status === "completed") {
          setResults(data)
          setIsLoading(false)
          eventSource.close()
          toast({
            title: "Success",
            description: "Analysis completed",
            className: "bg-success text-success-foreground",
          })
        } else if (data.status === "failed") {
          setIsLoading(false)
          eventSource.close()
          toast({
            title: "Error",
            description: data.error || "Analysis failed",
            variant: "destructive",
          })
        } else if (data.status === "processing") {
          // Analysis in progress
          console.log("Analysis in progress...")
        }
      }

      eventSource.onerror = () => {
        setIsLoading(false)
        eventSource.close()
        toast({
          title: "Error",
          description: "Connection error. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Unable to analyze website. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">Website Analysis</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Enter any website URL to receive a detailed report on performance, accessibility, and technical issues
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
            <Button type="submit" disabled={isLoading} size="lg" className="px-8">
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </Card>

        {/* Loading State */}
        {isLoading && <AnalysisLoading />}

        {/* Results */}
        {results && !isLoading && <AnalysisResults data={results} />}
      </div>

      <Toaster />
    </main>
  )
}
