import { type NextRequest } from "next/server";
import { createMockAnalysisData } from "@/lib/constants/mock-data";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const job_id = url.searchParams.get("job_id");

  if (!job_id) {
    return new Response("job_id is required", { status: 400 });
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // TODO: Replace this with actual job status polling from your backend
      // Poll your backend API for job status and send updates

      // Simulate processing
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "processing", job_id })}\n\n`));

      // Simulate completion after 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockData = createMockAnalysisData(job_id);
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(mockData)}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
