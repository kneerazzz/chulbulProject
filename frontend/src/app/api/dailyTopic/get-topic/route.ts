import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await requireAuth();
        const { searchParams } = new URL(req.url);
        const skillPlanId = searchParams.get("skillPlanId");
        const day = searchParams.get("day");

        if (!skillPlanId || !day) {
            return new NextResponse("Missing skillPlanId or day", { status: 400 });
        }

        const backendRes = await fetch(
            `${API_BASE_URL}/dailyTopics/c/${skillPlanId}/get-topic?day=${day}`, 
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Cookie: req.headers.get("cookie") || "",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                credentials: "include"
            }
        );

        if (!backendRes.ok) {
            const error = await backendRes.json();
            return NextResponse.json(
                { error: error.message || "Backend error" },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}