import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth();

    const backendRes = await fetch("http://localhost:4000/api/v1/skills/get-all-skills", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
