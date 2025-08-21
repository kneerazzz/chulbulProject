import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    try{
        const token = await requireAuth();
        const cookieHeader = req.headers.get("cookie") || ""
        const url = new URL(req.url)
        const skillPlanId = url.searchParams.get("skillPlanId")

        if(!skillPlanId) {
            return new NextResponse("SkillId is required", {status: 400})
        }

        const backendRes = await fetch(`${API_BASE_URL}/skillplans/c/${skillPlanId}/get-progress`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader,
                ...(token ? {Authorization: `Bearer ${token}`}: {})
            },
            credentials: 'include'
        })

        if(!backendRes.ok){
            const errorText = await backendRes.text()
            return new NextResponse(errorText, {status: backendRes.status })
        }

        const data = await backendRes.json()

        return NextResponse.json(data)

    }catch(error: any) {
        return new NextResponse(error, {status: 401})
    }
}