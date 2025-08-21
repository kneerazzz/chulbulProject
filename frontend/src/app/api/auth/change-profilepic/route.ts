// app/api/auth/change-profilepic/route.ts
import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const token = await requireAuth();

    // ✅ Convert Next.js request into FormData
    const formData = await req.formData();

    const backendRes = await fetch(`${API_BASE_URL}/users/update-profile-pic`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        cookie: req.headers.get("cookie") || "",
        // ❌ don't set Content-Type, fetch handles FormData automatically
      },
      body: formData, // ✅ forward the real FormData
    });

    if (!backendRes.ok) {
      const error = await backendRes.text();
      return new NextResponse(error, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
