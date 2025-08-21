import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    // Get the token securely from cookie
    const token = await requireAuth();

    const cookieHeader = req.headers.get("cookie") || ""

    const url = new URL(req.url)

    const skillId = url.searchParams.get("skillId")

    if(!skillId){
        return new NextResponse("Skill ID is required", {status: 400})
    }
    // Parse request JSON body
    const body = await req.json();

    // Forward request to backend API
    const backendRes = await fetch(`${API_BASE_URL}/skillplans/c/${skillId}/create-skill-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
        ...(token? { Authorization: `Bearer ${token}`}: {})
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    // If backend response is not OK, forward error text and status
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, { status: backendRes.status });
    }

    // Parse backend JSON response
    const data = await backendRes.json();

    // Return backend data as JSON response
    return NextResponse.json(data);
  } catch (error: any) {
    // Token missing or invalid
    return new NextResponse(error, { status: 401 });
  }
}
