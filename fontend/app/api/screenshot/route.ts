import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  const device = url.searchParams.get("device");

  console.log('Screenshot API called with:', { jobId, device });

  if (!jobId || !device) {
    return NextResponse.json(
      { error: "jobId and device parameters are required" },
      { status: 400 }
    );
  }

  try {
    // Proxy the request to backend screenshot endpoint
    const backendUrl = `${BACKEND_URL}/api/v1/screenshot/${jobId}/${device}`;
    console.log('Proxying screenshot request to:', backendUrl);

    const response = await fetch(backendUrl);

    if (!response.ok) {
      console.log('Backend returned error:', response.status, response.statusText);
      // If backend returns 404, show placeholder
      if (response.status === 404) {
        return NextResponse.redirect("/placeholder.svg");
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    console.log('Successfully got image from backend');
    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Screenshot fetch error:", error);
    // Return placeholder on any error
    return NextResponse.redirect("/placeholder.svg");
  }
}
