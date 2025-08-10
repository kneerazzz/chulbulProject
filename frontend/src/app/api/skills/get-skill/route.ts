// app/api/skills/get-skill/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication - identical to working endpoint
    const token = await requireAuth();
    console.log("Token received:", token ? "Yes" : "No");
    
    // 2. Get skillId - ensure it exists
    const skillId = req.nextUrl.searchParams.get("skillId");
    if (!skillId) {
      console.error("No skillId provided");
      return new NextResponse("Skill ID is required", { status: 400 });
    }

    // 3. Prepare headers - match working endpoint exactly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Include both cookie and Authorization if they exist
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) headers.cookie = cookieHeader;
    if (token) headers.Authorization = `Bearer ${token}`;

    console.log("Request headers:", headers);

    // 4. Make backend request - identical pattern to working endpoint
    const backendUrl = `http://localhost:4000/api/v1/skills/c/${skillId}/get-skill`;
    console.log("Calling backend:", backendUrl);
    
    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers,
      credentials: 'include'
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend responded with:", errorText);
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API route error:", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}