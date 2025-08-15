// app/api/skills/get-skill/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication - get the token
    const token = await requireAuth();
    
    const url = new URL(req.url);
    const skillId = url.searchParams.get("skillId");
    
    // 2. Validate skillId
    if (!skillId) {
      return new NextResponse("Skill ID is required", { status: 400 });
    }


    // 3. Get cookies from the original request
    const cookieHeader = req.headers.get("cookie") || "";

    // 4. Make backend request with proper authentication
    const backendUrl = `${API_BASE_URL}/skills/c/${skillId}/get-skill`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Include cookie header if present
    if (cookieHeader) {
      headers.cookie = cookieHeader;
    }

    // Include Authorization header if token is available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers,
      credentials: 'include'
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend responded with:", backendRes.status, errorText);
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API route error:", error);
    // Don't assume it's always unauthorized - return the actual error
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}