import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth();
    
    // Get all cookies from the incoming request
    const cookieHeader = req.cookies.toString();

    const backendRes = await fetch(`${API_BASE_URL}/skillplans/get-skill-plans`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        // Also forward the authorization if needed
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: 'include' // Important for cookies
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in skills API:", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}