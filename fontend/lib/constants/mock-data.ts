export const createMockAnalysisData = (jobId: string) => ({
  job_id: jobId,
  status: "completed",
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  processing_time_seconds: 165,
  target_url: "https://example.com",
  overall_score: 85,
  summary:
    "The website has good performance with fast page load times. However, there are some accessibility issues that need to be addressed to improve user experience.",
  screenshots: {
    desktop: "/desktop-website-screenshot.png",
    mobile: "/mobile-website-screenshot.png",
    tablet: "/tablet-website-screenshot.png",
  },
  performance: {
    load_time: 2.3,
    first_contentful_paint: 1.2,
    time_to_interactive: 3.1,
    total_page_size: 1.8,
  },
  report_data: {
    issues: [
      {
        id: "issue-001",
        category: "Accessibility",
        severity: "Critical",
        title: "Low color contrast",
        description:
          "Some text has insufficient contrast against the background, making it difficult for users with visual impairments.",
        recommendation:
          "Increase contrast between text and background to at least 4.5:1 for normal text and 3:1 for large text.",
      },
      {
        id: "issue-002",
        category: "Performance",
        severity: "High",
        title: "Unoptimized images",
        description: "Many images are larger than necessary, increasing page load time.",
        recommendation: "Compress and optimize images, use WebP or AVIF format for better performance.",
      },
      {
        id: "issue-003",
        category: "SEO",
        severity: "Medium",
        title: "Missing meta description",
        description: "Some pages are missing meta description tags, affecting SEO.",
        recommendation:
          "Add unique and descriptive meta description tags for each page, 150-160 characters long.",
      },
    ],
    issues_metadata: {
      total: 3,
      critical: 1,
      high: 1,
      medium: 1,
      low: 0,
    },
  },
  comparison: {
    performance: 85,
    accessibility: 72,
    best_practices: 90,
    seo: 78,
  },
  metadata: {
    analyzer_version: "2.0.1",
    model_used: "gpt-4",
    analysis_date: new Date().toISOString(),
  },
});

